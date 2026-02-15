import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendEmail, getOtpEmailHtml } from "@/lib/email";

function generateSlug(nama: string): string {
  return nama
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(email: string, otpCode: string, adminName: string, schoolName: string) {
  // Get active SMTP config
  const smtp = await prisma.smtpConfig.findFirst({ where: { is_active: true, is_default: true } });
  if (!smtp) {
    console.error("No active SMTP config found, OTP not sent");
    return;
  }

  const html = getOtpEmailHtml({ adminName, schoolName, otpCode });

  try {
    await sendEmail(
      {
        host: smtp.host,
        port: smtp.port,
        username: smtp.username,
        password: smtp.password,
        from_email: smtp.from_email,
        from_name: smtp.from_name,
        encryption: smtp.encryption as "tls" | "ssl" | "none",
      },
      {
        to: email,
        subject: `${otpCode} — Kode Verifikasi Kehadiran`,
        html,
        template: "otp_verification",
      }
    );

    // Log email
    await prisma.emailLog.create({
      data: { to_email: email, subject: `Kode Verifikasi Kehadiran`, template: "otp_verification", status: "sent", sent_at: new Date() },
    });
  } catch (e) {
    console.error("Failed to send OTP email:", e);
    await prisma.emailLog.create({
      data: { to_email: email, subject: `Kode Verifikasi Kehadiran`, template: "otp_verification", status: "failed", error: String(e) },
    });
  }
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
      // If user exists but not verified, allow re-registration (resend OTP)
      if (!existingUser.email_verified && existingUser.tenant_id) {
        const otpCode = generateOtp();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        await prisma.user.update({
          where: { id: existingUser.id },
          data: { otp_code: otpCode, otp_expires_at: otpExpires },
        });

        const tenant = await prisma.tenant.findUnique({ where: { id: existingUser.tenant_id } });
        await sendOtpEmail(email, otpCode, existingUser.nama_lengkap, tenant?.nama_sekolah || nama_sekolah);

        return NextResponse.json({
          success: true,
          message: "Kode verifikasi telah dikirim ulang ke email Anda.",
          requireVerification: true,
          email,
        });
      }

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

    // Generate OTP
    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // Create tenant + user in a transaction (NO subscription yet, tenant inactive)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create tenant (inactive until verified + plan chosen)
      const tenant = await tx.tenant.create({
        data: {
          nama_sekolah,
          slug,
          alamat: alamat || null,
          nomor_telepon: telepon_sekolah || null,
          email: email_sekolah || email,
          is_active: false,
        },
      });

      // 2. Create admin user (inactive, not verified)
      const user = await tx.user.create({
        data: {
          tenant_id: tenant.id,
          username: email.split("@")[0],
          email,
          password_hash,
          role: "admin",
          nama_lengkap,
          nomor_telepon: nomor_telepon || null,
          is_active: false,
          email_verified: false,
          otp_code: otpCode,
          otp_expires_at: otpExpires,
        },
      });

      return { tenant, user };
    });

    // Send OTP email (async, don't block response)
    sendOtpEmail(email, otpCode, nama_lengkap, nama_sekolah);

    return NextResponse.json({
      success: true,
      message: "Kode verifikasi telah dikirim ke email Anda.",
      requireVerification: true,
      email,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
