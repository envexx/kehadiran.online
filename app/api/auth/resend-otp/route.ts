import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, getOtpEmailHtml } from "@/lib/email";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: "Email sudah diverifikasi", alreadyVerified: true }, { status: 400 });
    }

    // Rate limit: don't allow resend within 60 seconds
    if (user.otp_expires_at) {
      const lastSent = new Date(user.otp_expires_at.getTime() - 15 * 60 * 1000); // otp_expires = sent + 15min
      const cooldown = new Date(lastSent.getTime() + 60 * 1000); // 60s cooldown
      if (new Date() < cooldown) {
        return NextResponse.json({ error: "Tunggu 60 detik sebelum mengirim ulang" }, { status: 429 });
      }
    }

    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp_code: otpCode, otp_expires_at: otpExpires },
    });

    // Send email
    const smtp = await prisma.smtpConfig.findFirst({ where: { is_active: true, is_default: true } });
    if (smtp) {
      const html = getOtpEmailHtml({
        adminName: user.nama_lengkap,
        schoolName: user.tenant?.nama_sekolah || "Sekolah",
        otpCode,
      });

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

        await prisma.emailLog.create({
          data: { to_email: email, subject: "Kode Verifikasi Kehadiran", template: "otp_verification", status: "sent", sent_at: new Date() },
        });
      } catch (e) {
        console.error("Failed to resend OTP:", e);
        await prisma.emailLog.create({
          data: { to_email: email, subject: "Kode Verifikasi Kehadiran", template: "otp_verification", status: "failed", error: String(e) },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Kode verifikasi baru telah dikirim ke email Anda.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Resend OTP error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
