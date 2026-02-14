import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, getRegistrationEmailHtml, getResetPasswordEmailHtml, getPaymentSuccessEmailHtml } from "@/lib/email";
import type { SmtpConfig } from "@/lib/email";

// POST /api/admin/send-email - Send email using SMTP
export async function POST(request: Request) {
  let to = "";
  let template = "";
  let subject = "";

  try {
    const body = await request.json();
    to = body.to;
    template = body.template;
    const data = body.data;
    const smtpConfigId = body.smtp_config_id;

    if (!to || !template) {
      return NextResponse.json({ success: false, error: "Missing 'to' or 'template'" }, { status: 400 });
    }

    // Fetch SMTP config from database
    const dbConfig = smtpConfigId
      ? await prisma.smtpConfig.findUnique({ where: { id: smtpConfigId } })
      : await prisma.smtpConfig.findFirst({ where: { is_default: true, is_active: true } })
        || await prisma.smtpConfig.findFirst({ where: { is_active: true } });

    if (!dbConfig) {
      return NextResponse.json({ success: false, error: "Tidak ada konfigurasi SMTP yang aktif. Silakan tambahkan SMTP terlebih dahulu." }, { status: 400 });
    }

    const smtpConfig: SmtpConfig = {
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      from_email: dbConfig.from_email,
      from_name: dbConfig.from_name,
      encryption: dbConfig.encryption as "tls" | "ssl" | "none",
    };

    let html = "";

    // Try to get template from DB first
    const dbTemplate = await prisma.emailTemplate.findUnique({ where: { key: template } });

    if (dbTemplate && dbTemplate.is_active) {
      subject = dbTemplate.subject
        .replace(/\{\{nama\}\}/g, data?.nama || "User")
        .replace(/\{\{nama_sekolah\}\}/g, data?.nama_sekolah || "Sekolah")
        .replace(/\{\{invoice_number\}\}/g, data?.invoice_number || "");
      html = dbTemplate.body_html
        .replace(/\{\{nama\}\}/g, data?.nama || "User")
        .replace(/\{\{nama_sekolah\}\}/g, data?.nama_sekolah || "Sekolah")
        .replace(/\{\{link\}\}/g, data?.link || "#")
        .replace(/\{\{plan\}\}/g, data?.plan || "")
        .replace(/\{\{amount\}\}/g, data?.amount || "")
        .replace(/\{\{periode\}\}/g, data?.periode || "")
        .replace(/\{\{invoice_number\}\}/g, data?.invoice_number || "")
        .replace(/\{\{due_date\}\}/g, data?.due_date || "")
        .replace(/\{\{sisa_hari\}\}/g, data?.sisa_hari || "");
    } else {
      // Fallback to hardcoded templates
      switch (template) {
        case "registration":
          subject = "Verifikasi Akun Kehadiran";
          html = getRegistrationEmailHtml({
            schoolName: data?.schoolName || "Sekolah",
            verifyUrl: data?.verifyUrl || `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=test`,
            adminName: data?.adminName || "Admin",
          });
          break;
        case "reset_password":
          subject = "Reset Password - Kehadiran";
          html = getResetPasswordEmailHtml({
            resetUrl: data?.resetUrl || `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=test`,
            userName: data?.userName || "User",
          });
          break;
        case "payment_success":
          subject = `Pembayaran Berhasil - ${data?.invoiceNumber || "Invoice"}`;
          html = getPaymentSuccessEmailHtml({
            schoolName: data?.schoolName || "Sekolah",
            invoiceNumber: data?.invoiceNumber || "INV-0000",
            amount: data?.amount || "Rp 0",
            plan: data?.plan || "Starter",
            period: data?.period || "1 bulan",
          });
          break;
        default:
          subject = `Test Email - ${template}`;
          html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px"><h2>Test Email</h2><p>Ini adalah test email dari template <strong>${template}</strong>.</p><p>Dikirim melalui SMTP: <strong>${dbConfig.name}</strong> (${dbConfig.host}:${dbConfig.port})</p><p style="color:#6b7280;font-size:13px;margin-top:24px">— Kehadiran Platform</p></div>`;
      }
    }

    const result = await sendEmail(smtpConfig, { to, subject, html, template });

    // Log to EmailLog table
    await prisma.emailLog.create({
      data: { to_email: to, subject, template, status: "sent", sent_at: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: `Email berhasil dikirim ke ${to}`,
      messageId: result.messageId,
      smtp: dbConfig.name,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // Log failure to EmailLog table
    try {
      await prisma.emailLog.create({
        data: { to_email: to || "unknown", subject: subject || template, template: template || "unknown", status: "failed", error: message },
      });
    } catch (_) { /* ignore log errors */ }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
