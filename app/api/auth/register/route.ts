import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "kehadiran-super-secret-key-change-in-production";

function generateSlug(nama: string): string {
  return nama
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nama_lengkap,
      email,
      nomor_telepon,
      password,
      nama_sekolah,
      jenjang,
      alamat,
      telepon_sekolah,
      email_sekolah,
    } = body;

    // Validation
    if (!nama_lengkap || !email || !password || !nama_sekolah) {
      return NextResponse.json(
        { error: "Nama, email, password, dan nama sekolah wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login atau gunakan email lain." },
        { status: 409 }
      );
    }

    // Generate unique slug
    let baseSlug = generateSlug(nama_sekolah);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.tenant.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create tenant + user + subscription in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create tenant
      const tenant = await tx.tenant.create({
        data: {
          nama_sekolah,
          slug,
          alamat: alamat || null,
          nomor_telepon: telepon_sekolah || null,
          email: email_sekolah || email,
          is_active: true,
        },
      });

      // 2. Create admin user for this tenant
      const user = await tx.user.create({
        data: {
          tenant_id: tenant.id,
          username: email.split("@")[0],
          email,
          password_hash,
          role: "admin",
          nama_lengkap,
          nomor_telepon: nomor_telepon || null,
          is_active: true,
        },
      });

      // 3. Create free trial subscription (30 siswa, 30 hari)
      const now = new Date();
      const trialEnd = new Date(now);
      trialEnd.setDate(trialEnd.getDate() + 30);

      const subscription = await tx.subscription.create({
        data: {
          tenant_id: tenant.id,
          plan: "free",
          status: "trial",
          billing_cycle: "monthly",
          amount: 0,
          currency: "IDR",
          started_at: now,
          ended_at: trialEnd,
        },
      });

      // 4. Create feature quota for free trial (30 siswa max)
      await tx.featureQuota.create({
        data: {
          tenant_id: tenant.id,
          max_siswa: 30,
          max_guru: 5,
          max_kelas: 5,
          sms_quota: 0,
          api_calls: 0,
          storage_gb: 0.5,
          features: {
            qr: true,
            notifikasi_wa: false,
            laporan: true,
            export: false,
            api: false,
          },
        },
      });

      return { tenant, user, subscription };
    });

    // Create JWT token for auto-login
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      sub: result.user.id,
      email: result.user.email,
      role: result.user.role,
      tenantId: result.tenant.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Selamat datang di Kehadiran.",
      user: {
        id: result.user.id,
        email: result.user.email,
        nama: result.user.nama_lengkap,
        role: result.user.role,
      },
      tenant: {
        id: result.tenant.id,
        nama: result.tenant.nama_sekolah,
        slug: result.tenant.slug,
      },
      subscription: {
        plan: result.subscription.plan,
        status: result.subscription.status,
        trial_ends: result.subscription.ended_at,
      },
    });

    // Set auth cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
