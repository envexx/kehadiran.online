import nodemailer from "nodemailer";

export interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  encryption: "tls" | "ssl" | "none";
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  template?: string;
  tenantId?: string;
}

// Create nodemailer transporter from SMTP config
export function createTransporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.encryption === "ssl",
    auth: {
      user: config.username,
      pass: config.password,
    },
    tls: config.encryption === "tls" ? { rejectUnauthorized: false } : undefined,
  });
}

// Send email using provided SMTP config
export async function sendEmail(config: SmtpConfig, options: SendEmailOptions) {
  const transporter = createTransporter(config);

  const mailOptions = {
    from: `"${config.from_name}" <${config.from_email}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
}

// Test SMTP connection
export async function testSmtpConnection(config: SmtpConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter(config);
    await transporter.verify();
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export function getOtpEmailHtml(data: { adminName: string; schoolName: string; otpCode: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#2563eb;padding:32px 24px;text-align:center;">
          <h1 style="color:#fff;font-size:24px;margin:0;">Kehadiran</h1>
          <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">Sistem Presensi Digital</p>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1e293b;font-size:20px;margin:0 0 8px;">Kode Verifikasi</h2>
          <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Halo <strong>${data.adminName}</strong>,<br><br>
            Terima kasih telah mendaftarkan <strong>${data.schoolName}</strong> di Kehadiran.
            Gunakan kode berikut untuk memverifikasi email Anda:
          </p>
          <div style="text-align:center;margin:24px 0;">
            <div style="display:inline-block;background:#f1f5f9;border:2px dashed #2563eb;border-radius:12px;padding:16px 40px;">
              <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#1e293b;">${data.otpCode}</span>
            </div>
          </div>
          <p style="color:#64748b;font-size:13px;line-height:1.5;margin:16px 0 0;text-align:center;">
            Kode ini berlaku selama <strong>15 menit</strong>.
          </p>
          <p style="color:#94a3b8;font-size:12px;line-height:1.5;margin:24px 0 0;">
            Jika Anda tidak mendaftar di Kehadiran, abaikan email ini.
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} Kehadiran — PT Core Solution Digital</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getRegistrationEmailHtml(data: { schoolName: string; verifyUrl: string; adminName: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#2563eb;padding:32px 24px;text-align:center;">
          <h1 style="color:#fff;font-size:24px;margin:0;">Kehadiran</h1>
          <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">Sistem Presensi Digital</p>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1e293b;font-size:20px;margin:0 0 8px;">Verifikasi Akun Anda</h2>
          <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Halo <strong>${data.adminName}</strong>,<br><br>
            Terima kasih telah mendaftarkan <strong>${data.schoolName}</strong> di Kehadiran. 
            Silakan klik tombol di bawah untuk memverifikasi akun Anda.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${data.verifyUrl}" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
              Verifikasi Akun
            </a>
          </div>
          <p style="color:#94a3b8;font-size:12px;line-height:1.5;margin:24px 0 0;">
            Link ini berlaku selama 24 jam. Jika Anda tidak mendaftar, abaikan email ini.
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} Kehadiran — PT Core Solution Digital</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getResetPasswordEmailHtml(data: { resetUrl: string; userName: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#2563eb;padding:32px 24px;text-align:center;">
          <h1 style="color:#fff;font-size:24px;margin:0;">Kehadiran</h1>
          <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">Reset Password</p>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1e293b;font-size:20px;margin:0 0 8px;">Reset Password Anda</h2>
          <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Halo <strong>${data.userName}</strong>,<br><br>
            Kami menerima permintaan untuk mereset password akun Anda. 
            Klik tombol di bawah untuk membuat password baru.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${data.resetUrl}" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color:#94a3b8;font-size:12px;line-height:1.5;margin:24px 0 0;">
            Link ini berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} Kehadiran — PT Core Solution Digital</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getPaymentSuccessEmailHtml(data: { schoolName: string; invoiceNumber: string; amount: string; plan: string; period: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#059669;padding:32px 24px;text-align:center;">
          <h1 style="color:#fff;font-size:24px;margin:0;">Pembayaran Berhasil</h1>
          <p style="color:#a7f3d0;font-size:14px;margin:8px 0 0;">Kehadiran — Sistem Presensi Digital</p>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Pembayaran untuk <strong>${data.schoolName}</strong> telah berhasil diproses.
          </p>
          <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:0 0 24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Invoice</td><td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;text-align:right;">${data.invoiceNumber}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Plan</td><td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;text-align:right;">${data.plan}</td></tr>
              <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Periode</td><td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;text-align:right;">${data.period}</td></tr>
              <tr style="border-top:1px solid #e2e8f0;"><td style="padding:12px 0 6px;color:#1e293b;font-size:14px;font-weight:700;">Total</td><td style="padding:12px 0 6px;color:#059669;font-size:16px;font-weight:700;text-align:right;">${data.amount}</td></tr>
            </table>
          </div>
          <p style="color:#94a3b8;font-size:12px;line-height:1.5;">
            Subscription Anda telah diperpanjang. Terima kasih telah menggunakan Kehadiran.
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} Kehadiran — PT Core Solution Digital</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
