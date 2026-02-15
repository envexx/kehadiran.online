import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function todayAt(h: number, m: number) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

async function main() {
  console.log("🌱 Seeding demo account...\n");

  const demoPw = await bcrypt.hash("demokehadiran", 12);

  // ============================================
  // 1. DEMO TENANT
  // ============================================
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo-kehadiran" },
    update: { is_active: true },
    create: {
      nama_sekolah: "SMK Negeri 1 Demo",
      slug: "demo-kehadiran",
      email: "demo@kehadiran.online",
      alamat: "Jl. Gajah Mada No. 10, Batam, Kepulauan Riau",
      nomor_telepon: "0778-123456",
      is_active: true,
      qr_mode: "flexible",
    },
  });
  console.log("✅ Tenant:", tenant.nama_sekolah);

  // ============================================
  // 2. DEMO ADMIN USER
  // ============================================
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@kehadiran.online" },
    update: { password_hash: demoPw, is_active: true, email_verified: true, tenant_id: tenant.id },
    create: {
      username: "demo_admin",
      email: "demo@kehadiran.online",
      password_hash: demoPw,
      role: "admin",
      nama_lengkap: "Admin Demo",
      nomor_telepon: "081234567890",
      is_active: true,
      email_verified: true,
      tenant_id: tenant.id,
    },
  });
  console.log("✅ Demo user:", demoUser.email, "/ demokehadiran");

  // ============================================
  // 3. SUBSCRIPTION
  // ============================================
  await prisma.subscription.upsert({
    where: { tenant_id: tenant.id },
    update: { status: "active", ended_at: new Date(Date.now() + 365 * 86400000) },
    create: {
      tenant_id: tenant.id,
      plan: "pro",
      status: "active",
      billing_cycle: "monthly",
      amount: 0,
      currency: "IDR",
      started_at: daysAgo(30),
      ended_at: new Date(Date.now() + 365 * 86400000),
    },
  });
  console.log("✅ Subscription: Pro (active)");

  // ============================================
  // 4. FEATURE QUOTA
  // ============================================
  await prisma.featureQuota.upsert({
    where: { tenant_id: tenant.id },
    update: {},
    create: {
      tenant_id: tenant.id,
      max_siswa: 500,
      max_guru: 50,
      max_kelas: 30,
      sms_quota: 5000,
      api_calls: 50000,
      storage_gb: 5,
    },
  });
  console.log("✅ Feature quota set");

  // ============================================
  // 5. JADWAL (Senin - Sabtu)
  // ============================================
  const jadwalData = [
    { hari: "senin", jam_masuk: "07:00", jam_pulang: "15:00" },
    { hari: "selasa", jam_masuk: "07:00", jam_pulang: "15:00" },
    { hari: "rabu", jam_masuk: "07:00", jam_pulang: "15:00" },
    { hari: "kamis", jam_masuk: "07:00", jam_pulang: "15:00" },
    { hari: "jumat", jam_masuk: "07:00", jam_pulang: "11:30" },
    { hari: "sabtu", jam_masuk: "07:00", jam_pulang: "12:00" },
  ];

  const jadwalMap: Record<string, string> = {};
  for (const j of jadwalData) {
    const jadwal = await prisma.jadwal.upsert({
      where: { tenant_id_hari: { tenant_id: tenant.id, hari: j.hari } },
      update: { jam_masuk: j.jam_masuk, jam_pulang: j.jam_pulang, is_active: true },
      create: { tenant_id: tenant.id, hari: j.hari, jam_masuk: j.jam_masuk, jam_pulang: j.jam_pulang, is_active: true },
    });
    jadwalMap[j.hari] = jadwal.id;
  }
  console.log("✅ Jadwal: Senin-Sabtu");

  // ============================================
  // 6. KELAS
  // ============================================
  const kelasData = [
    { nama_kelas: "X RPL 1", tingkat: "X", jurusan: "RPL", tahun_ajaran: "2025/2026", semester: "genap" },
    { nama_kelas: "X RPL 2", tingkat: "X", jurusan: "RPL", tahun_ajaran: "2025/2026", semester: "genap" },
    { nama_kelas: "XI RPL 1", tingkat: "XI", jurusan: "RPL", tahun_ajaran: "2025/2026", semester: "genap" },
    { nama_kelas: "XI TKJ 1", tingkat: "XI", jurusan: "TKJ", tahun_ajaran: "2025/2026", semester: "genap" },
    { nama_kelas: "XII RPL 1", tingkat: "XII", jurusan: "RPL", tahun_ajaran: "2025/2026", semester: "genap" },
    { nama_kelas: "XII TKJ 1", tingkat: "XII", jurusan: "TKJ", tahun_ajaran: "2025/2026", semester: "genap" },
  ];

  const kelasIds: string[] = [];
  for (const k of kelasData) {
    const kelas = await prisma.kelas.upsert({
      where: { tenant_id_nama_kelas_tahun_ajaran_semester: { tenant_id: tenant.id, nama_kelas: k.nama_kelas, tahun_ajaran: k.tahun_ajaran, semester: k.semester } },
      update: {},
      create: { tenant_id: tenant.id, nama_kelas: k.nama_kelas, tingkat: k.tingkat, jurusan: k.jurusan, tahun_ajaran: k.tahun_ajaran, semester: k.semester },
    });
    kelasIds.push(kelas.id);
  }
  console.log("✅ Kelas:", kelasData.length, "kelas");

  // ============================================
  // 7. GURU
  // ============================================
  const guruData = [
    { nama_guru: "Pak Ahmad Fauzi", nip: "198501012010011001", email: "ahmad.fauzi@smkn1demo.sch.id", nomor_wa: "6281234567001" },
    { nama_guru: "Bu Sri Wahyuni", nip: "198703152011012002", email: "sri.wahyuni@smkn1demo.sch.id", nomor_wa: "6281234567002" },
    { nama_guru: "Pak Irwan Setiawan", nip: "199001202012011003", email: "irwan.s@smkn1demo.sch.id", nomor_wa: "6281234567003" },
    { nama_guru: "Bu Dewi Lestari", nip: "198812102013012004", email: "dewi.l@smkn1demo.sch.id", nomor_wa: "6281234567004" },
    { nama_guru: "Pak Budi Santoso", nip: "198605252014011005", email: "budi.s@smkn1demo.sch.id", nomor_wa: "6281234567005" },
  ];

  for (const g of guruData) {
    await prisma.guru.upsert({
      where: { tenant_id_nip: { tenant_id: tenant.id, nip: g.nip } },
      update: {},
      create: { tenant_id: tenant.id, nama_guru: g.nama_guru, nip: g.nip, email: g.email, nomor_wa: g.nomor_wa, is_active: true },
    });
  }
  console.log("✅ Guru:", guruData.length, "guru");

  // ============================================
  // 8. SISWA (with parent data)
  // ============================================
  const siswaNames = [
    { nama: "Andi Pratama", jk: "L", ayah: "Budi Pratama", ibu: "Siti Pratama" },
    { nama: "Budi Setiawan", jk: "L", ayah: "Hendra Setiawan", ibu: "Rina Setiawan" },
    { nama: "Citra Dewi", jk: "P", ayah: "Agus Dewi", ibu: "Lina Dewi" },
    { nama: "Dian Permata", jk: "P", ayah: "Joko Permata", ibu: "Yuni Permata" },
    { nama: "Eko Saputra", jk: "L", ayah: "Wahyu Saputra", ibu: "Ani Saputra" },
    { nama: "Fitri Handayani", jk: "P", ayah: "Rudi Handayani", ibu: "Mega Handayani" },
    { nama: "Galih Ramadhan", jk: "L", ayah: "Tono Ramadhan", ibu: "Dewi Ramadhan" },
    { nama: "Hana Safitri", jk: "P", ayah: "Dedi Safitri", ibu: "Nia Safitri" },
    { nama: "Irfan Maulana", jk: "L", ayah: "Asep Maulana", ibu: "Tuti Maulana" },
    { nama: "Jasmine Putri", jk: "P", ayah: "Bambang Putri", ibu: "Ratna Putri" },
    { nama: "Kevin Wijaya", jk: "L", ayah: "Andi Wijaya", ibu: "Sari Wijaya" },
    { nama: "Lestari Wulandari", jk: "P", ayah: "Surya Wulandari", ibu: "Eka Wulandari" },
    { nama: "Muhammad Rizki", jk: "L", ayah: "Fajar Rizki", ibu: "Indah Rizki" },
    { nama: "Nadia Rahmawati", jk: "P", ayah: "Hasan Rahmawati", ibu: "Wati Rahmawati" },
    { nama: "Oscar Firmansyah", jk: "L", ayah: "Doni Firmansyah", ibu: "Lilis Firmansyah" },
    { nama: "Putri Ayu Lestari", jk: "P", ayah: "Yanto Lestari", ibu: "Murni Lestari" },
    { nama: "Rafi Ahmad", jk: "L", ayah: "Zainal Ahmad", ibu: "Kartini Ahmad" },
    { nama: "Sinta Maharani", jk: "P", ayah: "Eko Maharani", ibu: "Sulis Maharani" },
    { nama: "Teguh Prasetyo", jk: "L", ayah: "Wawan Prasetyo", ibu: "Yeni Prasetyo" },
    { nama: "Ulfa Nurhasanah", jk: "P", ayah: "Ridwan Nurhasanah", ibu: "Fitri Nurhasanah" },
    { nama: "Vino Pratama", jk: "L", ayah: "Agung Pratama", ibu: "Lina Pratama" },
    { nama: "Winda Sari", jk: "P", ayah: "Darmawan Sari", ibu: "Neni Sari" },
    { nama: "Yoga Aditya", jk: "L", ayah: "Suparman Aditya", ibu: "Umi Aditya" },
    { nama: "Zahra Amelia", jk: "P", ayah: "Firman Amelia", ibu: "Rina Amelia" },
  ];

  const siswaIds: string[] = [];
  for (let i = 0; i < siswaNames.length; i++) {
    const s = siswaNames[i];
    const kelasIdx = i % kelasIds.length;
    const nisn = `00${(30001 + i).toString()}`;
    const nis = `${2024}${(i + 1).toString().padStart(3, "0")}`;

    const siswa = await prisma.siswa.upsert({
      where: { tenant_id_nisn: { tenant_id: tenant.id, nisn } },
      update: {},
      create: {
        tenant_id: tenant.id,
        nisn,
        nis,
        nama_lengkap: s.nama,
        jenis_kelamin: s.jk,
        tempat_lahir: "Batam",
        tanggal_lahir: new Date(2008, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        kelas_id: kelasIds[kelasIdx],
        tahun_masuk: 2024,
        status: "aktif",
        nama_ayah: s.ayah,
        nomor_wa_ayah: `62812345${(67100 + i).toString()}`,
        nama_ibu: s.ibu,
        nomor_wa_ibu: `62812345${(68100 + i).toString()}`,
        preferensi_notifikasi: i % 3 === 0 ? "keduanya" : i % 2 === 0 ? "ibu" : "ayah",
      },
    });
    siswaIds.push(siswa.id);
  }
  console.log("✅ Siswa:", siswaNames.length, "siswa (with parent data)");

  // ============================================
  // 9. PRESENSI DATA (last 7 days)
  // ============================================
  const dayNames = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
  let presensiCount = 0;

  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const date = daysAgo(dayOffset);
    const dayName = dayNames[date.getDay()];

    // Skip Sunday
    if (dayName === "minggu") continue;

    const jadwalId = jadwalMap[dayName];
    if (!jadwalId) continue;

    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < siswaIds.length; i++) {
      // Check if presensi already exists
      const exists = await prisma.presensi.findFirst({
        where: { tenant_id: tenant.id, siswa_id: siswaIds[i], tanggal: dateStart },
      });
      if (exists) continue;

      // Randomize status: 80% hadir, 10% terlambat, 5% alpha, 3% izin, 2% sakit
      const rand = Math.random();
      let statusMasuk: string;
      let waktuMasuk: Date;

      if (rand < 0.80) {
        statusMasuk = "hadir";
        waktuMasuk = new Date(date);
        waktuMasuk.setHours(6, 45 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 60), 0);
      } else if (rand < 0.90) {
        statusMasuk = "terlambat";
        waktuMasuk = new Date(date);
        waktuMasuk.setHours(7, 5 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 60), 0);
      } else if (rand < 0.95) {
        statusMasuk = "alpha";
        waktuMasuk = new Date(date);
        waktuMasuk.setHours(7, 0, 0, 0);
      } else if (rand < 0.98) {
        statusMasuk = "izin";
        waktuMasuk = new Date(date);
        waktuMasuk.setHours(7, 0, 0, 0);
      } else {
        statusMasuk = "sakit";
        waktuMasuk = new Date(date);
        waktuMasuk.setHours(7, 0, 0, 0);
      }

      // Add pulang time for hadir/terlambat
      let waktuPulang: Date | null = null;
      let statusPulang: string | null = null;
      if (statusMasuk === "hadir" || statusMasuk === "terlambat") {
        const pulangHour = dayName === "jumat" ? 11 : dayName === "sabtu" ? 12 : 15;
        waktuPulang = new Date(date);
        waktuPulang.setHours(pulangHour, Math.floor(Math.random() * 15), Math.floor(Math.random() * 60), 0);
        statusPulang = "pulang";
      }

      await prisma.presensi.create({
        data: {
          tenant_id: tenant.id,
          siswa_id: siswaIds[i],
          jadwal_id: jadwalId,
          tanggal: dateStart,
          waktu_masuk: statusMasuk !== "alpha" ? waktuMasuk : null,
          waktu_pulang: waktuPulang,
          status_masuk: statusMasuk,
          status_pulang: statusPulang,
          metode_input: Math.random() > 0.3 ? "qr_code" : "manual",
          input_by: demoUser.id,
        },
      });
      presensiCount++;
    }
  }
  console.log("✅ Presensi:", presensiCount, "records (last 7 days)");

  // ============================================
  // 10. TODAY'S PRESENSI (partial - morning only)
  // ============================================
  const todayDayName = dayNames[new Date().getDay()];
  const todayJadwalId = jadwalMap[todayDayName];

  if (todayDayName !== "minggu" && todayJadwalId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Only seed ~60% of students for today (simulating ongoing day)
    const todayCount = Math.floor(siswaIds.length * 0.6);
    let todayPresensi = 0;

    for (let i = 0; i < todayCount; i++) {
      const exists = await prisma.presensi.findFirst({
        where: { tenant_id: tenant.id, siswa_id: siswaIds[i], tanggal: todayStart },
      });
      if (exists) continue;

      const rand = Math.random();
      const status = rand < 0.85 ? "hadir" : "terlambat";
      const waktu = todayAt(6, 50 + Math.floor(Math.random() * (status === "hadir" ? 10 : 25)));

      await prisma.presensi.create({
        data: {
          tenant_id: tenant.id,
          siswa_id: siswaIds[i],
          jadwal_id: todayJadwalId,
          tanggal: todayStart,
          waktu_masuk: waktu,
          status_masuk: status,
          metode_input: "qr_code",
          input_by: demoUser.id,
        },
      });
      todayPresensi++;
    }
    console.log("✅ Today's presensi:", todayPresensi, "records (ongoing)");
  }

  console.log("\n🎉 Demo account seeded!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Email    : demo@kehadiran.online");
  console.log("🔑 Password : demokehadiran");
  console.log("🏫 Sekolah  : SMK Negeri 1 Demo");
  console.log("👨‍🎓 Siswa    :", siswaNames.length);
  console.log("👨‍🏫 Guru     :", guruData.length);
  console.log("📚 Kelas    :", kelasData.length);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("❌ Seeding error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
