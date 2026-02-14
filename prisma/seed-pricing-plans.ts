import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding pricing plans...\n");

  const plans = [
    {
      key: "starter",
      name: "Starter",
      description: "Paket untuk sekolah kecil dengan 1-100 siswa",
      price_per_siswa: 12000,
      original_price: null,
      min_siswa: 1,
      max_siswa: 100,
      max_guru: 20,
      max_kelas: 10,
      sms_quota: 1000,
      api_calls: 10000,
      storage_gb: 1,
      features: ["1–100 siswa", "Maks 20 guru", "Maks 10 kelas", "QR Code scan", "Email support", "1.000 notifikasi WA/bulan"],
      is_popular: false,
      is_active: true,
      sort_order: 1,
    },
    {
      key: "pro",
      name: "Professional",
      description: "Paket untuk sekolah menengah dengan 101-500 siswa",
      price_per_siswa: 10000,
      original_price: null,
      min_siswa: 101,
      max_siswa: 500,
      max_guru: 50,
      max_kelas: 30,
      sms_quota: 5000,
      api_calls: 50000,
      storage_gb: 5,
      features: ["101–500 siswa", "Maks 50 guru", "Maks 30 kelas", "QR + Manual input", "Notifikasi WA real-time", "Laporan lengkap", "Export CSV", "5.000 notifikasi WA/bulan"],
      is_popular: true,
      is_active: true,
      sort_order: 2,
    },
    {
      key: "enterprise",
      name: "Enterprise",
      description: "Paket untuk sekolah besar dengan 500+ siswa",
      price_per_siswa: 8999,
      original_price: null,
      min_siswa: 501,
      max_siswa: 5000,
      max_guru: 200,
      max_kelas: 100,
      sms_quota: 20000,
      api_calls: 200000,
      storage_gb: 20,
      features: ["500+ siswa", "Maks 200 guru", "Maks 100 kelas", "Semua fitur Pro", "Custom domain (+Rp 3jt setup)", "Dedicated account manager", "20.000 notifikasi WA/bulan", "API access"],
      is_popular: false,
      is_active: true,
      sort_order: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { key: plan.key },
      update: {
        name: plan.name,
        description: plan.description,
        price_per_siswa: plan.price_per_siswa,
        min_siswa: plan.min_siswa,
        max_siswa: plan.max_siswa,
        max_guru: plan.max_guru,
        max_kelas: plan.max_kelas,
        sms_quota: plan.sms_quota,
        api_calls: plan.api_calls,
        storage_gb: plan.storage_gb,
        features: plan.features,
        is_popular: plan.is_popular,
        is_active: plan.is_active,
        sort_order: plan.sort_order,
      },
      create: plan,
    });
    console.log(`✅ Plan: ${plan.name}`);
  }

  console.log("\n🎉 Pricing plans seeded!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
