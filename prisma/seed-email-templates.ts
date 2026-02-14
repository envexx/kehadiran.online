import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  {
    key: "registration",
    name: "Registrasi Akun",
    description: "Email verifikasi saat sekolah baru mendaftar",
    subject: "Verifikasi Akun - {{nama_sekolah}} | Kehadiran",
    body_html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1e40af">Selamat Datang di Kehadiran!</h2>
  <p>Halo <strong>{{nama}}</strong>,</p>
  <p>Terima kasih telah mendaftarkan <strong>{{nama_sekolah}}</strong> di platform Kehadiran.</p>
  <p>Silakan klik tombol di bawah untuk memverifikasi akun Anda:</p>
  <a href="{{link}}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Verifikasi Akun</a>
  <p style="color:#6b7280;font-size:13px">Link ini berlaku selama 24 jam. Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
</div>`,
    variables: ["nama", "nama_sekolah", "link"],
    is_active: true,
  },
  {
    key: "reset_password",
    name: "Reset Password",
    description: "Email link reset password",
    subject: "Reset Password - Kehadiran",
    body_html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1e40af">Reset Password</h2>
  <p>Halo <strong>{{nama}}</strong>,</p>
  <p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk membuat password baru:</p>
  <a href="{{link}}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Reset Password</a>
  <p style="color:#6b7280;font-size:13px">Link ini berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.</p>
</div>`,
    variables: ["nama", "link"],
    is_active: true,
  },
  {
    key: "payment_success",
    name: "Pembayaran Berhasil",
    description: "Konfirmasi pembayaran subscription",
    subject: "Pembayaran Berhasil - {{nama_sekolah}} | Kehadiran",
    body_html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#059669">Pembayaran Berhasil!</h2>
  <p>Halo <strong>{{nama}}</strong>,</p>
  <p>Pembayaran untuk <strong>{{nama_sekolah}}</strong> telah berhasil diproses.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:8px 0;color:#6b7280">Plan</td><td style="padding:8px 0;font-weight:600">{{plan}}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Jumlah</td><td style="padding:8px 0;font-weight:600">{{amount}}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Periode</td><td style="padding:8px 0;font-weight:600">{{periode}}</td></tr>
  </table>
  <p style="color:#6b7280;font-size:13px">Terima kasih telah menggunakan Kehadiran.</p>
</div>`,
    variables: ["nama", "nama_sekolah", "plan", "amount", "periode"],
    is_active: true,
  },
  {
    key: "invoice",
    name: "Invoice",
    description: "Kirim invoice tagihan bulanan",
    subject: "Invoice {{invoice_number}} - {{nama_sekolah}} | Kehadiran",
    body_html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1e40af">Invoice Tagihan</h2>
  <p>Halo <strong>{{nama}}</strong>,</p>
  <p>Berikut invoice tagihan untuk <strong>{{nama_sekolah}}</strong>:</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:8px 0;color:#6b7280">No. Invoice</td><td style="padding:8px 0;font-weight:600">{{invoice_number}}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Jumlah</td><td style="padding:8px 0;font-weight:600">{{amount}}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280">Jatuh Tempo</td><td style="padding:8px 0;font-weight:600">{{due_date}}</td></tr>
  </table>
  <a href="{{link}}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Bayar Sekarang</a>
  <p style="color:#6b7280;font-size:13px">Harap lakukan pembayaran sebelum tanggal jatuh tempo.</p>
</div>`,
    variables: ["nama", "nama_sekolah", "invoice_number", "amount", "due_date", "link"],
    is_active: true,
  },
  {
    key: "welcome",
    name: "Welcome Email",
    description: "Email selamat datang setelah verifikasi",
    subject: "Selamat Datang di Kehadiran, {{nama}}!",
    body_html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#1e40af">Selamat Datang!</h2>
  <p>Halo <strong>{{nama}}</strong>,</p>
  <p>Akun <strong>{{nama_sekolah}}</strong> telah berhasil diverifikasi dan siap digunakan.</p>
  <p>Berikut langkah selanjutnya:</p>
  <ol>
    <li>Tambahkan data guru dan kelas</li>
    <li>Import data siswa</li>
    <li>Atur jadwal presensi</li>
    <li>Cetak kartu QR untuk siswa</li>
  </ol>
  <a href="{{link}}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Masuk ke Dashboard</a>
  <p style="color:#6b7280;font-size:13px">Butuh bantuan? Hubungi tim support kami.</p>
</div>`,
    variables: ["nama", "nama_sekolah", "link"],
    is_active: false,
  },
  {
    key: "trial_expiring",
    name: "Trial Expiring",
    description: "Notifikasi trial akan berakhir",
    subject: "Trial Anda Akan Berakhir - {{nama_sekolah}} | Kehadiran",
    body_html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#d97706">Trial Akan Berakhir</h2>
  <p>Halo <strong>{{nama}}</strong>,</p>
  <p>Trial <strong>{{nama_sekolah}}</strong> akan berakhir dalam <strong>{{sisa_hari}} hari</strong>.</p>
  <p>Upgrade sekarang untuk terus menggunakan semua fitur Kehadiran tanpa gangguan:</p>
  <a href="{{link}}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Upgrade Sekarang</a>
  <p style="color:#6b7280;font-size:13px">Setelah trial berakhir, akses akan dibatasi ke fitur dasar.</p>
</div>`,
    variables: ["nama", "nama_sekolah", "sisa_hari", "link"],
    is_active: true,
  },
];

async function main() {
  console.log("Seeding email templates...");

  for (const t of templates) {
    await prisma.emailTemplate.upsert({
      where: { key: t.key },
      update: {
        name: t.name,
        description: t.description,
        subject: t.subject,
        body_html: t.body_html,
        variables: t.variables,
        is_active: t.is_active,
      },
      create: t,
    });
    console.log(`  ✓ ${t.key}`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
