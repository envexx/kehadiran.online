import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "kehadiran-super-secret-key-change-in-production";

export async function POST(request: Request) {
  try {
    const { email, planKey } = await request.json();

    if (!email || !planKey) {
      return NextResponse.json({ error: "Email dan plan wajib dipilih" }, { status: 400 });
    }

    // Find verified user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.email_verified) {
      return NextResponse.json({ error: "Email belum diverifikasi" }, { status: 400 });
    }

    if (!user.tenant_id) {
      return NextResponse.json({ error: "Tenant tidak ditemukan" }, { status: 400 });
    }

    // Check if subscription already exists (prevent double-submit)
    const existingSub = await prisma.subscription.findUnique({ where: { tenant_id: user.tenant_id } });
    if (existingSub) {
      // Already has plan, just auto-login
      const secret = new TextEncoder().encode(JWT_SECRET);
      const token = await new SignJWT({
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(secret);

      const response = NextResponse.json({
        success: true,
        message: "Selamat datang di Kehadiran!",
      });

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    // Get plan details from DB
    const plan = await prisma.pricingPlan.findUnique({ where: { key: planKey } });

    const isFree = planKey === "free";
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 30);

    // Create subscription + quota + activate tenant in transaction
    await prisma.$transaction(async (tx) => {
      // 1. Activate tenant
      await tx.tenant.update({
        where: { id: user.tenant_id! },
        data: { is_active: true },
      });

      // 2. Create subscription
      await tx.subscription.create({
        data: {
          tenant_id: user.tenant_id!,
          plan: planKey,
          status: isFree ? "trial" : "pending",
          billing_cycle: "monthly",
          amount: isFree ? 0 : Number(plan?.price_per_siswa || 0),
          currency: "IDR",
          started_at: now,
          ended_at: trialEnd,
        },
      });

      // 3. Create feature quota
      await tx.featureQuota.create({
        data: {
          tenant_id: user.tenant_id!,
          max_siswa: isFree ? 30 : (plan?.max_siswa || 100),
          max_guru: isFree ? 5 : (plan?.max_guru || 20),
          max_kelas: isFree ? 5 : (plan?.max_kelas || 10),
          sms_quota: isFree ? 0 : (plan?.sms_quota || 1000),
          api_calls: isFree ? 0 : (plan?.api_calls || 10000),
          storage_gb: isFree ? 0.5 : Number(plan?.storage_gb || 1),
          features: isFree
            ? { qr: true, notifikasi_wa: false, laporan: true, export: false, api: false }
            : { qr: true, notifikasi_wa: true, laporan: true, export: true, api: planKey === "enterprise" },
        },
      });
    });

    // Auto-login: create JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: isFree
        ? "Selamat datang! Anda mendapat free trial 30 hari."
        : `Plan ${plan?.name || planKey} berhasil dipilih. Selamat datang!`,
    });

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
    console.error("Choose plan error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
