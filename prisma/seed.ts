import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

async function main() {
  console.log("🌱 Seeding database...\n");
  const pw = await bcrypt.hash("Kehadiran2026online!", 12);
  const adminPw = await bcrypt.hash("Admin123!", 12);

  // 1. Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "super@kehadiran.online" },
    update: {},
    create: { username: "superadmin", email: "super@kehadiran.online", password_hash: pw, role: "superadmin", nama_lengkap: "Super Admin", is_active: true },
  });
  console.log("✅ Super Admin:", superAdmin.email);

  // 2. Demo Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "sma-demo" },
    update: {},
    create: { nama_sekolah: "SMA Demo Kehadiran", slug: "sma-demo", email: "admin@sma-demo.sch.id", alamat: "Jl. Pendidikan No. 1, Jakarta", nomor_telepon: "021-1234567", is_active: true, qr_mode: "flexible" },
  });
  console.log("✅ Tenant:", tenant.nama_sekolah);

  // 3. Admin user for tenant
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@sma-demo.sch.id" },
    update: {},
    create: { username: "admin_sma_demo", email: "admin@sma-demo.sch.id", password_hash: adminPw, role: "admin", nama_lengkap: "Admin SMA Demo", is_active: true, tenant_id: tenant.id },
  });
  console.log("✅ Admin user:", adminUser.email);

  // 4. Subscription
  await prisma.subscription.upsert({
    where: { tenant_id: tenant.id },
    update: {},
    create: { tenant_id: tenant.id, plan: "pro", status: "active", billing_cycle: "monthly", amount: 599000, currency: "IDR", started_at: daysAgo(60), ended_at: new Date(Date.now() + 30 * 86400000) },
  });
  console.log("✅ Subscription created");

  // 5. Invoice
  const invExists = await prisma.invoice.findFirst({ where: { tenant_id: tenant.id } });
  if (!invExists) {
    await prisma.invoice.create({
      data: { tenant_id: tenant.id, invoice_number: "INV-2026-0001", amount: 599000, status: "paid", issued_at: daysAgo(30), due_at: daysAgo(15), paid_at: daysAgo(14), payment_method: "bank_transfer" },
    });
    console.log("✅ Invoice created");
  }

  // 6. Audit log entries
  const auditExists = await prisma.auditLog.count();
  if (auditExists === 0) {
    await prisma.auditLog.createMany({
      data: [
        { user_id: superAdmin.id, action: "login", entity_type: "user", ip_address: "103.28.12.45", created_at: daysAgo(0) },
        { tenant_id: tenant.id, user_id: adminUser.id, action: "create", entity_type: "siswa", entity_id: "demo", changes: { nama: "Siswa Demo" }, ip_address: "182.1.45.67", created_at: daysAgo(1) },
        { user_id: superAdmin.id, action: "update", entity_type: "smtp_config", changes: { field: "host", old: "old.smtp.com", new: "smtp.resend.com" }, ip_address: "103.28.12.45", created_at: daysAgo(2) },
        { tenant_id: tenant.id, user_id: adminUser.id, action: "login", entity_type: "user", ip_address: "182.1.45.67", created_at: daysAgo(3) },
      ],
    });
    console.log("✅ Audit logs created");
  }

  // 7. Email logs
  const emailExists = await prisma.emailLog.count();
  if (emailExists === 0) {
    await prisma.emailLog.createMany({
      data: [
        { tenant_id: tenant.id, to_email: "admin@sma-demo.sch.id", subject: "Verifikasi Akun Kehadiran", template: "registration", status: "sent", sent_at: daysAgo(5) },
        { tenant_id: tenant.id, to_email: "admin@sma-demo.sch.id", subject: "Pembayaran Berhasil - INV-2026-0001", template: "payment_success", status: "sent", sent_at: daysAgo(14) },
        { to_email: "test@example.com", subject: "Test Email SMTP", template: "registration", status: "failed", error: "Connection timeout", created_at: daysAgo(1) },
      ],
    });
    console.log("✅ Email logs created");
  }

  // 8. SMTP Config
  const smtpExists = await prisma.smtpConfig.count();
  if (smtpExists === 0) {
    await prisma.smtpConfig.create({
      data: { name: "Default SMTP", host: "smtp.gmail.com", port: 587, username: "noreply@kehadiran.online", password: "encrypted_placeholder", from_email: "noreply@kehadiran.online", from_name: "Kehadiran", encryption: "tls", is_active: true, is_default: true },
    });
    console.log("✅ SMTP config created");
  }

  console.log("\n🎉 Seeding selesai!");
}

main()
  .catch((e) => { console.error("❌ Seeding error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
