# Kehadiran.online

**Platform Manajemen Presensi Sekolah Berbasis Cloud** oleh [PT CORE SOLUTION DIGITAL](https://www.coresolution.digital/)

Kehadiran.online adalah platform SaaS multi-tenant untuk manajemen kehadiran siswa secara digital. Mendukung presensi via QR Code, input manual, notifikasi WhatsApp real-time ke orang tua, serta dashboard analitik lengkap untuk sekolah.

## Fitur Utama

- **Multi-Tenant** — Satu platform untuk banyak sekolah, masing-masing terisolasi
- **Presensi QR Code** — Scan QR siswa untuk presensi masuk & pulang
- **Notifikasi WhatsApp** — Kirim notifikasi otomatis ke orang tua via Fonnte API
- **Dashboard Analitik** — Statistik kehadiran harian, mingguan, dan bulanan
- **Manajemen Siswa** — CRUD siswa, import CSV, kartu presensi QR
- **Manajemen Guru & Kelas** — Data guru, kelas per semester, wali kelas
- **Jadwal Fleksibel** — Atur jam masuk/pulang per hari
- **Laporan & Export** — Laporan presensi dengan filter, export CSV
- **Billing & Subscription** — Paket langganan (Starter, Pro, Enterprise)
- **Superadmin Panel** — Kelola tenant, user, SMTP, pricing, WhatsApp config
- **Dark/Light Mode** — UI responsif dengan dukungan tema
- **Live Demo** — Akun demo siap pakai di halaman login

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| UI | [HeroUI v2](https://heroui.com/), [Tailwind CSS v4](https://tailwindcss.com/), [Phosphor Icons](https://phosphoricons.com/) |
| Database | PostgreSQL + [Prisma ORM](https://www.prisma.io/) |
| Auth | JWT (jose) + bcryptjs, OTP email verification |
| WhatsApp | [Fonnte API](https://fonnte.com/) dengan rate-limited queue |
| Email | Nodemailer + dynamic SMTP config |
| State | [SWR](https://swr.vercel.app/) untuk client-side data fetching |
| Deploy | [Vercel](https://vercel.com/) |

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env   # isi DATABASE_URL, JWT_SECRET, dll
npx prisma db push
npx prisma generate

# Seed data
npx tsx prisma/seed.ts                # superadmin + demo tenant
npx tsx prisma/seed-pricing-plans.ts  # pricing plans
npx tsx prisma/seed-demo.ts           # demo account (demo@kehadiran.online)

# Run dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Demo Account

| | |
|---|---|
| **Email** | `demo@kehadiran.online` |
| **Password** | `demokehadiran` |

Atau klik tombol **Live Demo** di halaman login.

## Dokumentasi

Lihat [DOCUMENTATION.md](./DOCUMENTATION.md) untuk dokumentasi lengkap meliputi arsitektur, alur kerja, API reference, dan database schema.

## Lisensi

Licensed under the [MIT License](./LICENSE).

Copyright (c) 2026 [PT CORE SOLUTION DIGITAL](https://www.coresolution.digital/)

