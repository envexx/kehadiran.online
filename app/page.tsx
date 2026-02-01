"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { 
  ShieldCheck,
  Clock,
  ChartLine,
  Bell,
  QrCode,
  DeviceMobile,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Star
} from "phosphor-react";
import Link from "next/link";
import Image from "next/image";
import { TextAnimate } from "@/components/magicui/text-animate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Highlighter } from "@/components/ui/highlighter";
import { TypingAnimation } from "@/components/ui/typing-animation";

export default function LandingPage() {
  const features = [
    {
      icon: QrCode,
      title: "Presensi QR Code",
      description: "Sistem presensi modern dengan QR Code untuk kecepatan dan akurasi maksimal"
    },
    {
      icon: DeviceMobile,
      title: "Mobile Friendly",
      description: "Akses dari mana saja dengan aplikasi mobile yang responsif dan mudah digunakan"
    },
    {
      icon: Bell,
      title: "Notifikasi WhatsApp",
      description: "Orang tua langsung mendapat notifikasi real-time via WhatsApp saat anak presensi"
    },
    {
      icon: ChartLine,
      title: "Analytics Lengkap",
      description: "Laporan dan statistik kehadiran yang detail untuk monitoring yang lebih baik"
    },
    {
      icon: ShieldCheck,
      title: "Keamanan Data",
      description: "Data terlindungi dengan enkripsi tingkat tinggi dan backup otomatis"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Pantau kehadiran siswa secara real-time dengan update instan"
    },
  ];

  const stats = [
    { value: "500+", label: "Sekolah Terpercaya" },
    { value: "50K+", label: "Siswa Aktif" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9", label: "Rating", icon: Star },
  ];

  const benefits = [
    "Presensi otomatis dengan QR Code",
    "Notifikasi real-time ke orang tua",
    "Laporan kehadiran lengkap",
    "Multi-tenant untuk banyak sekolah",
    "Dashboard analytics yang powerful",
    "Support 24/7"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-background/90 backdrop-blur-xl border border-divider/50 rounded-2xl shadow-lg px-4 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image 
                src="/kehadiran_png.png" 
                alt="Kehadiran Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold">Kehadiran</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-default-600 hover:text-primary transition-colors">
              Fitur
            </Link>
            <Link href="#pricing" className="text-default-600 hover:text-primary transition-colors">
              Harga
            </Link>
            <Link href="#about" className="text-default-600 hover:text-primary transition-colors">
              Tentang
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button as={Link} href="/dashboard" variant="light" size="sm">
              Masuk
            </Button>
            <Button as={Link} href="/dashboard" color="primary" size="sm">
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 md:px-8 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <Chip size="lg" variant="bordered" className="border-2 border-white text-white font-semibold">
                PERTAMA di Batam
              </Chip>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <div className="mb-2">Sistem Presensi Sekolah</div>
                <div className="text-yellow-300 mb-2">100% Terintegrasi WhatsApp</div>
                <div className="text-primary-100 text-4xl md:text-5xl">Harga Transparan & Terjangkau</div>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Platform presensi{" "}
                <Highlighter action="highlight" color="#fbbf24">
                  otomatis pertama
                </Highlighter>{" "}
                di Batam yang mengirim{" "}
                <Highlighter action="underline" color="#60a5fa">
                  notifikasi langsung ke WhatsApp orang tua
                </Highlighter>
                {" "}setiap kali anak mereka hadir atau tidak hadir di sekolah.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  as={Link}
                  href="/dashboard"
                  size="lg"
                  className="bg-white text-primary-600 font-semibold"
                  endContent={<ArrowRight weight="bold" />}
                >
                  Mulai Gratis
                </Button>
                <Button 
                  size="lg"
                  variant="bordered"
                  className="border-white text-white hover:bg-white/10"
                  startContent={<Play weight="fill" />}
                >
                  Lihat Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className="group relative bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    >
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative">
                        {/* Icon */}
                        {Icon && (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                            <Icon size={16} className="text-white" weight="fill" />
                          </div>
                        )}
                        
                        {/* Value */}
                        <p className="text-xl sm:text-2xl font-bold text-white mb-0.5 group-hover:text-yellow-200 transition-colors duration-500">
                          {stat.value}
                        </p>
                        
                        {/* Label */}
                        <p className="text-[10px] sm:text-xs text-white/90 font-medium leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative">
              {/* Logo Watermark */}
              <div className="absolute -top-8 -right-8 w-32 h-32 opacity-20">
                <Image 
                  src="/kehadiran_png.png" 
                  alt="Kehadiran Logo" 
                  width={128} 
                  height={128}
                  className="object-contain"
                />
              </div>
              
              <div className="relative bg-white rounded-2xl shadow-2xl p-4 z-10">
                {/* Mockup Dashboard */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Dashboard Presensi</h3>
                      <p className="text-sm text-default-500">Hari ini, 15 Jan 2025</p>
                    </div>
                    <Chip color="success" size="sm">Live</Chip>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="border border-divider/50">
                      <CardBody className="p-4">
                        <p className="text-xs text-default-500 mb-1">Total Siswa</p>
                        <p className="text-2xl font-bold">1,248</p>
                      </CardBody>
                    </Card>
                    <Card className="border border-divider/50">
                      <CardBody className="p-4">
                        <p className="text-xs text-default-500 mb-1">Hadir Hari Ini</p>
                        <p className="text-2xl font-bold text-success">1,180</p>
                      </CardBody>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-divider/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Ahmad Rizki</p>
                        <p className="text-xs text-default-400">XII RPL 1 • 08:15</p>
                      </div>
                      <Chip size="sm" color="success" variant="flat">Hadir</Chip>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-divider/50">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-success" weight="fill" />
                  <div>
                    <p className="text-xs font-semibold">Notifikasi Terkirim</p>
                    <p className="text-xs text-default-400">Ke orang tua</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Chip size="md" variant="bordered" className="mb-4 border-2 border-primary text-primary font-semibold">
              Fitur Unggulan
            </Chip>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <TypingAnimation 
                className="text-4xl md:text-5xl font-bold leading-normal tracking-normal"
                showCursor={false}
              >
                Semua yang Anda Butuhkan
              </TypingAnimation>
            </h2>
            <p className="text-xl text-default-500 max-w-2xl mx-auto">
              Platform presensi lengkap dengan{" "}
              <Highlighter action="highlight" color="#a78bfa" isView>
                fitur-fitur modern
              </Highlighter>{" "}
              untuk mengelola kehadiran siswa dengan efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group border-2 border-divider/30 hover:border-blue-500 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background to-default-50"
                >
                  <CardBody className="p-8">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500 ease-out" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 ease-out">
                        <Icon size={32} className="text-white" weight="fill" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-500 ease-out">
                      {feature.title}
                    </h3>
                    <p className="text-default-600 leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real-time Activity Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-default-50 via-success-50/30 to-default-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-success-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-success-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-3 h-3 bg-success-500 rounded-full"></div>
              </div>
              <Chip size="md" variant="bordered" className="border-2 border-success text-success font-semibold">
                Live Activity
              </Chip>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pantau Kehadiran Secara{" "}
              <Highlighter action="circle" color="#10b981" isView>
                Real-time
              </Highlighter>
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Lihat aktivitas presensi siswa yang terjadi saat ini dengan{" "}
              <Highlighter action="underline" color="#f59e0b" isView>
                update otomatis
              </Highlighter>
            </p>
          </div>

          <div className="relative w-full rounded-3xl border-2 border-divider/50 bg-background/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Header Bar */}
            <div className="bg-gradient-to-r from-success-500 to-success-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Clock size={20} className="text-white" weight="fill" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Aktivitas Hari Ini</p>
                  <p className="text-white/80 text-xs">Update setiap detik</p>
                </div>
              </div>
              <Chip size="sm" className="bg-white/20 text-white font-semibold border-0">
                15 Siswa
              </Chip>
            </div>

            <ScrollArea className="relative h-[500px] overflow-hidden">
              <div className="flex flex-col gap-3 p-6">
                {[
                  { name: "Ahmad Rizki", class: "XII RPL 1", time: "08:15", status: "success" },
                  { name: "Siti Nurhaliza", class: "XII RPL 2", time: "08:16", status: "success" },
                  { name: "Budi Santoso", class: "XII RPL 1", time: "08:17", status: "success" },
                  { name: "Dewi Lestari", class: "XII TKJ 1", time: "08:18", status: "success" },
                  { name: "Eko Prasetyo", class: "XII RPL 2", time: "08:19", status: "success" },
                  { name: "Fitri Handayani", class: "XII TKJ 2", time: "08:20", status: "success" },
                  { name: "Gilang Ramadhan", class: "XII RPL 1", time: "08:21", status: "success" },
                  { name: "Hani Rahmawati", class: "XII MM 1", time: "08:22", status: "success" },
                  { name: "Irfan Hakim", class: "XII RPL 2", time: "08:23", status: "success" },
                  { name: "Jasmine Putri", class: "XII TKJ 1", time: "08:24", status: "success" },
                  { name: "Khalid Abdullah", class: "XII RPL 1", time: "08:25", status: "warning" },
                  { name: "Linda Kusuma", class: "XII MM 2", time: "08:26", status: "success" },
                  { name: "Muhammad Iqbal", class: "XII RPL 2", time: "08:27", status: "success" },
                  { name: "Nadia Safitri", class: "XII TKJ 2", time: "08:28", status: "success" },
                  { name: "Oscar Pradipta", class: "XII RPL 1", time: "08:29", status: "success" },
                ].map((student, index) => (
                  <Card 
                    key={index}
                    className="group border-2 border-divider/30 hover:border-success-400 transition-all duration-500 ease-out hover:shadow-xl hover:-translate-x-1 bg-gradient-to-r from-background to-default-50/50"
                  >
                    <CardBody className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-success-400 to-success-600 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <Users size={24} className="text-white" weight="fill" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg group-hover:text-success-600 transition-colors duration-500">{student.name}</p>
                          <div className="flex items-center gap-2 text-sm text-default-500">
                            <span className="font-medium">{student.class}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock size={14} weight="fill" />
                              <span>{student.time}</span>
                            </div>
                          </div>
                        </div>
                        <Chip 
                          size="md" 
                          className={`font-bold shadow-md ${
                            student.status === "success" 
                              ? "bg-gradient-to-r from-success-500 to-success-600 text-white border-0" 
                              : "bg-gradient-to-r from-warning-500 to-warning-600 text-white border-0"
                          }`}
                        >
                          {student.status === "success" ? "✓ Hadir" : "⚠ Terlambat"}
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-default-100 border border-divider/50">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-default-600 font-medium">
                Scroll untuk melihat lebih banyak aktivitas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-8 bg-default-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Chip size="md" variant="bordered" className="mb-4 border-2 border-primary text-primary font-semibold">
                Keuntungan
              </Chip>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Mengapa Pilih{" "}
                <Highlighter action="box" color="#ec4899" isView>
                  Kehadiran
                </Highlighter>
                ?
              </h2>
              <p className="text-lg text-default-600 mb-8">
                Sistem presensi yang dirancang khusus untuk memudahkan pengelolaan kehadiran siswa 
                dengan{" "}
                <Highlighter action="highlight" color="#8b5cf6" isView>
                  teknologi terkini
                </Highlighter>{" "}
                dan dukungan penuh.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-success" weight="fill" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button 
                  as={Link}
                  href="/dashboard"
                  size="lg"
                  color="primary"
                  endContent={<ArrowRight weight="bold" />}
                >
                  Coba Sekarang
                </Button>
              </div>
            </div>

            <div className="relative">
              {/* Placeholder untuk screenshot/gambar aplikasi mobile */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white relative overflow-hidden">
                {/* Logo Background */}
                <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                  <Image 
                    src="/kehadiran_png.png" 
                    alt="Kehadiran Logo" 
                    width={256} 
                    height={256}
                    className="object-contain"
                  />
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4 relative z-10">
                  <h3 className="text-2xl font-bold">Aplikasi Mobile</h3>
                  <p className="text-white/90">
                    Akses presensi dari smartphone dengan mudah dan cepat
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-white/20 rounded-lg p-4">
                      <p className="text-3xl font-bold">QR</p>
                      <p className="text-sm">Scan Code</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <p className="text-3xl font-bold">📱</p>
                      <p className="text-sm">Mobile App</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Note: User bisa menambahkan screenshot aplikasi mobile di sini */}
              {/* Format gambar: PNG/JPG, ukuran optimal: 400x800px untuk mobile mockup */}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Chip size="md" variant="bordered" className="mb-4 border-2 border-primary text-primary font-semibold">
              Harga
            </Chip>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <TypingAnimation 
                className="text-4xl md:text-5xl font-bold leading-normal tracking-normal"
                showCursor={false}
              >
                Pilih Paket yang Tepat
              </TypingAnimation>
            </h2>
            <p className="text-xl text-default-500 max-w-2xl mx-auto">
              Paket{" "}
              <Highlighter action="highlight" color="#06b6d4" isView>
                fleksibel
              </Highlighter>{" "}
              untuk berbagai kebutuhan sekolah, dari kecil hingga besar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border border-divider/50">
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-2">Gratis</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Rp 0</span>
                  <span className="text-default-500">/bulan</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Hingga 50 siswa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Presensi QR Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Notifikasi WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Laporan Dasar</span>
                  </li>
                </ul>
                <Button variant="bordered" className="w-full">
                  Mulai Gratis
                </Button>
              </CardBody>
            </Card>

            {/* Starter Plan */}
            <Card className="border-2 border-primary shadow-lg">
              <CardBody className="p-6">
                <Chip color="primary" size="sm" className="mb-4">Paling Populer</Chip>
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Rp 500K</span>
                  <span className="text-default-500">/bulan</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Hingga 500 siswa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Semua fitur Gratis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Analytics Lengkap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Support Prioritas</span>
                  </li>
                </ul>
                <Button color="primary" className="w-full">
                  Pilih Paket
                </Button>
              </CardBody>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border border-divider/50">
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Unlimited siswa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Semua fitur Starter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Custom Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <span className="text-sm">Dedicated Support</span>
                  </li>
                </ul>
                <Button variant="bordered" className="w-full">
                  Hubungi Sales
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <TypingAnimation 
              className="text-4xl md:text-5xl font-bold leading-normal tracking-normal text-white"
              showCursor={false}
            >
              Siap Memulai? 🚀
            </TypingAnimation>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan{" "}
            <Highlighter action="highlight" color="#fde047">
              ratusan sekolah
            </Highlighter>{" "}
            yang sudah mempercayai Kehadiran untuk mengelola presensi siswa mereka
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              as={Link}
              href="/dashboard"
              size="lg"
              className="bg-white text-primary-600 font-semibold"
              endContent={<ArrowRight weight="bold" />}
            >
              Daftar Sekarang
            </Button>
            <Button 
              size="lg"
              variant="bordered"
              className="border-white text-white hover:bg-white/10"
            >
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 bg-background border-t border-divider/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <Image 
                    src="/kehadiran_png.png" 
                    alt="Kehadiran Logo" 
                    width={40} 
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Kehadiran</span>
              </div>
              <p className="text-sm text-default-500">
                Sistem presensi digital modern untuk sekolah masa depan
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-default-500">
                <li><Link href="#features" className="hover:text-primary">Fitur</Link></li>
                <li><Link href="#pricing" className="hover:text-primary">Harga</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-default-500">
                <li><Link href="#about" className="hover:text-primary">Tentang</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Karir</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-default-500">
                <li><Link href="#" className="hover:text-primary">Dokumentasi</Link></li>
                <li><Link href="#" className="hover:text-primary">Bantuan</Link></li>
                <li><Link href="#" className="hover:text-primary">Kontak</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-divider/50 text-center text-sm text-default-500">
            <p>© 2025 Kehadiran. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
