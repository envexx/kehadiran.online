import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email dan kode OTP wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: "Email sudah diverifikasi", alreadyVerified: true }, { status: 400 });
    }

    if (!user.otp_code || !user.otp_expires_at) {
      return NextResponse.json({ error: "Kode OTP tidak ditemukan. Silakan daftar ulang." }, { status: 400 });
    }

    if (new Date() > user.otp_expires_at) {
      return NextResponse.json({ error: "Kode OTP sudah kadaluarsa. Silakan kirim ulang." }, { status: 400 });
    }

    if (user.otp_code !== otp) {
      return NextResponse.json({ error: "Kode OTP salah" }, { status: 400 });
    }

    // Mark user as verified and active
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        is_active: true,
        otp_code: null,
        otp_expires_at: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email berhasil diverifikasi!",
      email: user.email,
      tenantId: user.tenant_id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Verify OTP error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
