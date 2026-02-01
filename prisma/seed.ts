import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Superadmin (tanpa tenant_id)
  const superadmin = await prisma.user.create({
    data: {
      tenant_id: null, // Superadmin tidak punya tenant_id
      username: 'superadmin',
      email: 'superadmin@kehadiran.com',
      password_hash: '$2b$10$example_hash_here', // Ganti dengan hash yang benar
      role: 'superadmin',
      nama_lengkap: 'Super Administrator',
    },
  });

  console.log('✅ Superadmin created');

  // 2. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      nama_sekolah: 'SMP ISLAM TERPADU',
      alamat: 'Jl. Pendidikan No. 123, Jakarta',
      nomor_telepon: '02112345678',
      email: 'info@smpislamterpadu.sch.id',
    },
  });

  console.log('✅ Tenant created:', tenant.nama_sekolah);

  // 3. Create Admin User (default role adalah admin)
  const admin = await prisma.user.create({
    data: {
      tenant_id: tenant.id,
      username: 'admin',
      email: 'admin@smpislamterpadu.sch.id',
      password_hash: '$2b$10$example_hash_here', // Ganti dengan hash yang benar
      role: 'admin', // Default role
      nama_lengkap: 'Administrator Sekolah',
    },
  });

  console.log('✅ Admin user created');

  // 3. Create Guru
  const guru1 = await prisma.guru.create({
    data: {
      tenant_id: tenant.id,
      nip: '196001011990031001',
      nama_guru: 'Budi Santoso',
      email: 'budi.santoso@smpislamterpadu.sch.id',
      nomor_wa: '6281234567800',
    },
  });

  const guru2 = await prisma.guru.create({
    data: {
      tenant_id: tenant.id,
      nip: '196002021990032002',
      nama_guru: 'Ani Lestari',
      email: 'ani.lestari@smpislamterpadu.sch.id',
      nomor_wa: '6281234567801',
    },
  });

  console.log('✅ Guru created');

  // 4. Create Kelas
  const kelas1 = await prisma.kelas.create({
    data: {
      tenant_id: tenant.id,
      nama_kelas: 'XII RPL 1',
      tingkat: 'XII',
      jurusan: 'RPL',
      tahun_ajaran: '2024/2025',
      semester: 'genap',
      kapasitas: 40,
    },
  });

  const kelas2 = await prisma.kelas.create({
    data: {
      tenant_id: tenant.id,
      nama_kelas: 'XII RPL 2',
      tingkat: 'XII',
      jurusan: 'RPL',
      tahun_ajaran: '2024/2025',
      semester: 'genap',
      kapasitas: 40,
    },
  });

  console.log('✅ Kelas created');

  // 5. Create Siswa (dengan data orang tua)
  const siswa1 = await prisma.siswa.create({
    data: {
      tenant_id: tenant.id,
      nisn: '0012345678',
      nis: '2024001',
      nama_lengkap: 'Ahmad Rizki Maulana',
      jenis_kelamin: 'L',
      kelas_id: kelas1.id,
      tahun_masuk: 2024,
      // Data Orang Tua
      nama_ayah: 'Rizki Maulana',
      nomor_wa_ayah: '6281234567890',
      nama_ibu: 'Siti Aminah',
      nomor_wa_ibu: '6281234567891',
      preferensi_notifikasi: 'keduanya',
    },
  });

  const siswa2 = await prisma.siswa.create({
    data: {
      tenant_id: tenant.id,
      nisn: '0012345679',
      nis: '2024002',
      nama_lengkap: 'Siti Nurhaliza',
      jenis_kelamin: 'P',
      kelas_id: kelas1.id,
      tahun_masuk: 2024,
      // Data Orang Tua
      nama_ayah: 'Ahmad Nurhaliza',
      nomor_wa_ayah: '6281234567892',
      nama_ibu: 'Dewi Lestari',
      nomor_wa_ibu: '6281234567893',
      preferensi_notifikasi: 'ibu',
    },
  });

  const siswa3 = await prisma.siswa.create({
    data: {
      tenant_id: tenant.id,
      nisn: '0012345680',
      nis: '2024003',
      nama_lengkap: 'Budi Santoso',
      jenis_kelamin: 'L',
      kelas_id: kelas2.id,
      tahun_masuk: 2024,
      // Data Orang Tua
      nama_ayah: 'Santoso Wijaya',
      nomor_wa_ayah: '6281234567894',
      nama_ibu: 'Ratna Sari',
      nomor_wa_ibu: '6281234567895',
      preferensi_notifikasi: 'ayah',
    },
  });

  console.log('✅ Siswa created');

  // 6. Create Jadwal (7 hari)
  const hari = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
  
  for (const h of hari) {
    await prisma.jadwal.create({
      data: {
        tenant_id: tenant.id,
        hari: h,
        jam_masuk: h === 'jumat' ? '07:00' : '07:30', // Jumat lebih awal
        jam_pulang: h === 'jumat' ? '11:30' : '15:00', // Jumat lebih cepat
      },
    });
  }

  console.log('✅ Jadwal created (7 hari)');

  // 7. Create Settings
  const settings = [
    {
      key: 'nama_sekolah',
      value: 'SMP ISLAM TERPADU',
      description: 'Nama sekolah yang ditampilkan di kartu presensi',
      category: 'general',
    },
    {
      key: 'whatsapp_api_key',
      value: 'your_api_key_here',
      description: 'API Key untuk WhatsApp Gateway',
      category: 'whatsapp',
    },
    {
      key: 'whatsapp_api_url',
      value: 'https://api.whatsapp.com/v1/send',
      description: 'URL API WhatsApp Gateway',
      category: 'whatsapp',
    },
    {
      key: 'notifikasi_alpha',
      value: 'true',
      description: 'Kirim notifikasi jika siswa alpha',
      category: 'notifikasi',
    },
    {
      key: 'notifikasi_hadir',
      value: 'false',
      description: 'Kirim notifikasi jika siswa hadir',
      category: 'notifikasi',
    },
    {
      key: 'notifikasi_laporan_harian',
      value: 'true',
      description: 'Kirim laporan harian ke orang tua',
      category: 'notifikasi',
    },
  ];

  for (const setting of settings) {
    await prisma.setting.create({
      data: {
        tenant_id: tenant.id,
        ...setting,
      },
    });
  }

  console.log('✅ Settings created');

  // 8. Create Subscription
  const subscription = await prisma.subscription.create({
    data: {
      tenant_id: tenant.id,
      plan: 'starter',
      status: 'active',
      billing_cycle: 'monthly',
      amount: 500000,
      currency: 'IDR',
      started_at: new Date(),
      ended_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari
    },
  });

  console.log('✅ Subscription created');

  // 9. Create Feature Quota
  const featureQuota = await prisma.featureQuota.create({
    data: {
      tenant_id: tenant.id,
      max_siswa: 500,
      max_guru: 50,
      max_kelas: 20,
      sms_quota: 5000,
      api_calls: 50000,
      storage_gb: 10,
      features: {
        whatsapp_notification: true,
        api_access: true,
        advanced_reporting: true,
        custom_branding: false,
      },
    },
  });

  console.log('✅ Feature Quota created');

  // 10. Create Sample Invoice
  const invoice = await prisma.invoice.create({
    data: {
      tenant_id: tenant.id,
      invoice_number: `INV-${tenant.id.substring(0, 8).toUpperCase()}-001`,
      amount: 500000,
      status: 'paid',
      issued_at: new Date(),
      due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
      paid_at: new Date(),
      payment_method: 'bank_transfer',
    },
  });

  console.log('✅ Invoice created');

  // 11. Create Sample Permissions
  const permissions = [
    { name: 'siswa.create', resource: 'siswa', action: 'create', description: 'Create siswa' },
    { name: 'siswa.read', resource: 'siswa', action: 'read', description: 'Read siswa' },
    { name: 'siswa.update', resource: 'siswa', action: 'update', description: 'Update siswa' },
    { name: 'siswa.delete', resource: 'siswa', action: 'delete', description: 'Delete siswa' },
    { name: 'presensi.create', resource: 'presensi', action: 'create', description: 'Create presensi' },
    { name: 'presensi.read', resource: 'presensi', action: 'read', description: 'Read presensi' },
    { name: 'presensi.update', resource: 'presensi', action: 'update', description: 'Update presensi' },
    { name: 'kelas.manage', resource: 'kelas', action: 'manage', description: 'Manage kelas' },
    { name: 'user.manage', resource: 'user', action: 'manage', description: 'Manage users' },
    { name: 'settings.manage', resource: 'settings', action: 'manage', description: 'Manage settings' },
  ];

  for (const perm of permissions) {
    await prisma.permission.create({
      data: perm,
    });
  }

  console.log('✅ Permissions created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

