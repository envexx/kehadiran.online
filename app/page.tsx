"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { 
  ShieldCheck,
  Clock,
  ChartLineUp,
  WhatsappLogo,
  QrCode,
  DeviceMobile,
  CheckCircle,
  ArrowRight,
  Check,
  Lightning,
  Rocket,
  Crown,
  Users,
  Student,
  Buildings,
  Star,
  ArrowUpRight
} from "phosphor-react";
import Link from "next/link";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const PLAN_ICONS: Record<string, typeof Lightning> = {
  starter: Lightning,
  pro: Rocket,
  enterprise: Crown,
};

export default function LandingPage() {
  const features = [
    { icon: QrCode, title: "QR Code Presensi", description: "Scan QR untuk presensi instan. Cepat, akurat, tanpa antri." },
    { icon: WhatsappLogo, title: "Notifikasi WhatsApp", description: "Orang tua langsung dapat notifikasi real-time saat anak hadir atau tidak." },
    { icon: ChartLineUp, title: "Analytics & Laporan", description: "Dashboard lengkap dengan statistik kehadiran harian, mingguan, dan bulanan." },
    { icon: DeviceMobile, title: "Mobile Friendly", description: "Akses dari smartphone, tablet, atau desktop. Responsive di semua perangkat." },
    { icon: ShieldCheck, title: "Keamanan Data", description: "Enkripsi end-to-end, backup otomatis, dan multi-tenancy yang aman." },
    { icon: Clock, title: "Real-time Tracking", description: "Pantau kehadiran siswa secara langsung dengan update instan setiap detik." },
  ];

  const stats = [
    { value: "500+", label: "Sekolah" },
    { value: "50K+", label: "Siswa Aktif" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9", label: "Rating" },
  ];

  const [dbPlans, setDbPlans] = useState<{ key: string; name: string; description: string | null; price_per_siswa: number; original_price: number | null; min_siswa: number; max_siswa: number; features: string[]; is_popular: boolean }[]>([]);

  useEffect(() => {
    fetch("/api/pricing-plans").then(r => r.json()).then(d => { if (d.data) setDbPlans(d.data); }).catch(() => {});
  }, []);

  const plans = [
    {
      name: "Free Demo",
      price: "Gratis",
      originalPrice: null as string | null,
      period: "30 hari",
      desc: "Coba dulu tanpa biaya",
      icon: Lightning,
      popular: false,
      features: ["Maks 30 siswa", "5 guru", "QR Code scan", "Laporan dasar", "Email support"],
    },
    ...dbPlans.map(p => ({
      name: p.name,
      price: `Rp ${p.price_per_siswa.toLocaleString("id-ID")}`,
      originalPrice: p.original_price ? `Rp ${p.original_price.toLocaleString("id-ID")}` : null,
      period: "/siswa/bulan",
      desc: p.description || `${p.min_siswa}–${p.max_siswa} siswa`,
      icon: PLAN_ICONS[p.key] || Lightning,
      popular: p.is_popular,
      features: (p.features || []) as string[],
    })),
  ];

  const liveActivity = [
    { name: "Ahmad Rizki", kelas: "XII RPL 1", waktu: "08:15", status: "Hadir" },
    { name: "Siti Nurhaliza", kelas: "XII RPL 2", waktu: "08:16", status: "Hadir" },
    { name: "Budi Santoso", kelas: "XII RPL 1", waktu: "08:17", status: "Hadir" },
    { name: "Dewi Lestari", kelas: "XII TKJ 1", waktu: "08:18", status: "Hadir" },
    { name: "Khalid Abdullah", kelas: "XII RPL 1", waktu: "08:25", status: "Terlambat" },
    { name: "Fitri Handayani", kelas: "XII TKJ 2", waktu: "08:20", status: "Hadir" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 relative">
              <Image src="/kehadiran_png.png" alt="Kehadiran" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-lg font-bold text-gray-900">Kehadiran</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Fitur</Link>
            <Link href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Harga</Link>
            <Link href="#about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Tentang</Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button as={Link} href="/login" variant="light" size="sm" className="text-gray-600 font-medium text-xs sm:text-sm">
              Masuk
            </Button>
            <Button as={Link} href="/register" color="primary" size="sm" className="bg-blue-600 font-medium text-xs sm:text-sm">
              Daftar Gratis
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <span className="text-xs font-semibold text-blue-700">Platform Presensi #1 di Batam</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 leading-[1.1] tracking-tight">
                Presensi Sekolah
                <br />
                <span className="text-blue-600">Modern & Otomatis</span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg">
                Sistem presensi QR Code terintegrasi WhatsApp. Orang tua langsung dapat notifikasi saat anak hadir di sekolah.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  as={Link}
                  href="/register"
                  size="lg"
                  className="bg-blue-600 text-white font-semibold px-8 hover:bg-blue-700"
                  endContent={<ArrowRight size={18} weight="bold" />}
                >
                  Mulai Gratis
                </Button>
                <Button 
                  as={Link}
                  href="/dashboard"
                  size="lg"
                  variant="bordered"
                  className="border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Lihat Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 sm:gap-8 pt-4">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual - Dashboard Mockup */}
            <div className="relative hidden lg:block">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/50 p-5 relative z-10">
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Dashboard Presensi</h3>
                      <p className="text-xs text-gray-400">Hari ini, 14 Feb 2025</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-semibold text-emerald-700">Live</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-3">
                      <p className="text-[10px] text-gray-400">Total Siswa</p>
                      <p className="text-xl font-bold text-gray-900">1,248</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3">
                      <p className="text-[10px] text-gray-400">Hadir</p>
                      <p className="text-xl font-bold text-emerald-600">1,180</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-3">
                      <p className="text-[10px] text-gray-400">Kehadiran</p>
                      <p className="text-xl font-bold text-blue-600">94.5%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {liveActivity.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Student size={14} className="text-blue-600" weight="fill" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-400">{item.kelas} &middot; {item.waktu}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          item.status === "Hadir" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -top-4 -left-6 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-3 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <WhatsappLogo size={16} className="text-green-600" weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">WA Terkirim</p>
                    <p className="text-[10px] text-gray-400">Ke orang tua Ahmad</p>
                  </div>
                </div>
              </div>

              {/* Floating QR card */}
              <div className="absolute -bottom-3 -right-4 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-3 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <QrCode size={16} className="text-blue-600" weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">QR Scanned</p>
                    <p className="text-[10px] text-gray-400">Siti Nurhaliza - 08:16</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 sm:py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-wider mb-6">Dipercaya oleh ratusan sekolah di Indonesia</p>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:25s]">
            {[
              { name: "SMAN 3 Bandung", kota: "Bandung" },
              { name: "SMKN 7 Semarang", kota: "Semarang" },
              { name: "SMA Labschool Jakarta", kota: "Jakarta" },
              { name: "SMPN 1 Surabaya", kota: "Surabaya" },
              { name: "SMKN 2 Malang", kota: "Malang" },
              { name: "SMAN 1 Yogyakarta", kota: "Yogyakarta" },
              { name: "SMP Al-Azhar Medan", kota: "Medan" },
              { name: "SMKN 4 Makassar", kota: "Makassar" },
            ].map((school) => (
              <figure
                key={school.name}
                className={cn(
                  "relative cursor-default overflow-hidden rounded-xl border px-5 py-3 mx-2",
                  "border-gray-100 bg-gray-50/50 hover:bg-gray-100/80 transition-colors"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Buildings size={16} className="text-blue-600" weight="fill" />
                  </div>
                  <div>
                    <figcaption className="text-sm font-semibold text-gray-900 whitespace-nowrap">{school.name}</figcaption>
                    <p className="text-[10px] text-gray-400">{school.kota}</p>
                  </div>
                </div>
              </figure>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <span className="text-xs font-semibold text-blue-700">Fitur Unggulan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Semua yang Sekolah Anda Butuhkan
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Platform presensi lengkap dengan fitur modern untuk mengelola kehadiran siswa secara efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                    <Icon size={22} className="text-blue-600 group-hover:text-white transition-colors duration-300" weight="fill" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <span className="text-xs font-semibold text-blue-700">Cara Kerja</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mudah dalam 3 Langkah
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Setup cepat, langsung bisa digunakan tanpa instalasi rumit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Daftar Sekolah", desc: "Buat akun dan masukkan data sekolah Anda. Proses hanya 2 menit.", icon: Buildings },
              { step: "02", title: "Input Data Siswa", desc: "Tambahkan data siswa beserta nomor WhatsApp orang tua.", icon: Users },
              { step: "03", title: "Mulai Presensi", desc: "Siswa scan QR Code, orang tua langsung dapat notifikasi WhatsApp.", icon: QrCode },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl font-bold text-blue-100">{item.step}</span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Icon size={20} className="text-blue-600" weight="fill" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Activity Preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <span className="text-xs font-semibold text-emerald-700">Real-time</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pantau Kehadiran Secara Langsung
              </h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Setiap kali siswa scan QR Code, data langsung muncul di dashboard dan notifikasi WhatsApp terkirim otomatis ke orang tua.
              </p>

              <div className="space-y-4">
                {[
                  "Update kehadiran instan tanpa delay",
                  "Notifikasi WhatsApp otomatis ke orang tua",
                  "Dashboard real-time untuk admin & guru",
                  "Deteksi terlambat otomatis berdasarkan jadwal",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Check size={12} weight="bold" className="text-emerald-600" />
                    </div>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Feed Mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Scan Terbaru</span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">Live</span>
              </div>
              <div className="divide-y divide-gray-50">
                {liveActivity.map((item, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Student size={16} className="text-blue-600" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.kelas} &middot; {item.waktu}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      item.status === "Hadir" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <span className="text-xs font-semibold text-blue-700">Harga Transparan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Tepat
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Paket fleksibel untuk berbagai kebutuhan sekolah. Tanpa biaya tersembunyi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border p-6 relative transition-all ${
                    plan.popular 
                      ? "border-blue-300 shadow-lg shadow-blue-100/50" 
                      : "border-gray-100 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-[10px] font-semibold bg-blue-600 text-white px-3 py-1 rounded-full">
                        Paling Populer
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Icon size={20} weight="fill" className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-xs text-gray-400">{plan.desc}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    {plan.originalPrice && <span className="text-sm text-gray-400 line-through mr-2">{plan.originalPrice}</span>}
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-400">{plan.period}</span>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <Check size={14} weight="bold" className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    as={Link}
                    href="/register"
                    size="sm"
                    className={`w-full font-medium ${
                      plan.popular 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pilih {plan.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Mereka?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Sekolah-sekolah yang sudah menggunakan Kehadiran
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Pak Ahmad Fauzi", role: "Kepala Sekolah, SMK Negeri 1 Batam", text: "Kehadiran sangat membantu kami memantau presensi siswa. Orang tua juga senang karena langsung dapat notifikasi WhatsApp." },
              { name: "Bu Sri Wahyuni", role: "Guru BK, SMA Negeri 2 Batam", text: "Sebelumnya kami manual, sekarang dengan QR Code semuanya otomatis. Laporan juga langsung jadi, tidak perlu rekap lagi." },
              { name: "Pak Irwan Setiawan", role: "Admin, SMP Islam Terpadu", text: "Setup-nya cepat, dalam 1 hari sudah bisa dipakai. Tim support-nya juga sangat responsif dan membantu." },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} weight="fill" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Siap Memulai?
              </h2>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                Bergabunglah dengan ratusan sekolah yang sudah mempercayai Kehadiran untuk mengelola presensi siswa mereka.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  as={Link}
                  href="/register"
                  size="lg"
                  className="bg-white text-blue-600 font-semibold hover:bg-blue-50"
                  endContent={<ArrowRight size={18} weight="bold" />}
                >
                  Daftar Gratis Sekarang
                </Button>
                <Button 
                  as={Link}
                  href="/dashboard"
                  size="lg"
                  className="bg-white/10 text-white font-medium border border-white/20 hover:bg-white/20"
                >
                  Lihat Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 relative">
                  <Image src="/kehadiran_png.png" alt="Kehadiran" width={32} height={32} className="object-contain" />
                </div>
                <span className="text-lg font-bold text-gray-900">Kehadiran</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sistem presensi digital modern untuk sekolah masa depan.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Produk</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Fitur</Link></li>
                <li><Link href="#pricing" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Harga</Link></li>
                <li><Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Perusahaan</h4>
              <ul className="space-y-2">
                <li><Link href="https://www.coresolution.digital/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">PT Core Solution Digital</Link></li>
                <li><Link href="#about" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Tentang Kehadiran</Link></li>
                <li><Link href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Produk Lainnya</h4>
              <ul className="space-y-2">
                <li><Link href="https://www.nilai.online/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Nilai.online — Ujian Anti Cheat</Link></li>
                <li><Link href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Dokumentasi</Link></li>
                <li><Link href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Bantuan</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Kehadiran. All rights reserved.</p>
            <p className="text-xs text-gray-400">Dibuat oleh <Link href="https://www.coresolution.digital/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">PT Core Solution Digital</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
