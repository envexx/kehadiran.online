# Kehadiran.online — Dokumentasi Lengkap

> Platform Manajemen Presensi Sekolah Berbasis Cloud  
> Oleh [PT CORE SOLUTION DIGITAL](https://www.coresolution.digital/)

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Struktur Proyek](#3-struktur-proyek)
4. [Database Schema](#4-database-schema)
5. [Autentikasi & Otorisasi](#5-autentikasi--otorisasi)
6. [Alur Registrasi Sekolah](#6-alur-registrasi-sekolah)
7. [Alur Presensi](#7-alur-presensi)
8. [Notifikasi WhatsApp](#8-notifikasi-whatsapp)
9. [Sistem Email](#9-sistem-email)
10. [Billing & Subscription](#10-billing--subscription)
11. [Panel Superadmin](#11-panel-superadmin)
12. [Panel Tenant (Sekolah)](#12-panel-tenant-sekolah)
13. [API Reference](#13-api-reference)
14. [Middleware & Security](#14-middleware--security)
15. [Deployment](#15-deployment)
16. [Seeder & Demo](#16-seeder--demo)
17. [Environment Variables](#17-environment-variables)

---

## 1. Gambaran Umum

Kehadiran.online adalah platform SaaS (Software as a Service) multi-tenant untuk manajemen kehadiran siswa di sekolah. Platform ini memungkinkan sekolah untuk:

- Mencatat presensi siswa secara digital via **QR Code** atau **input manual**
- Mengirim **notifikasi WhatsApp otomatis** ke orang tua saat siswa hadir, terlambat, alpha, atau pulang
- Memantau statistik kehadiran melalui **dashboard analitik**
- Mengelola data siswa, guru, kelas, dan jadwal
- Mengekspor **laporan presensi** dalam format CSV
- Mencetak **kartu presensi QR** untuk setiap siswa

### Multi-Tenancy

Setiap sekolah yang mendaftar menjadi satu **tenant** yang terisolasi. Data antar tenant tidak saling terlihat. Satu superadmin mengelola seluruh platform.

### Peran Pengguna

| Role | Akses | Login URL |
|------|-------|-----------|
| **Superadmin** | Panel admin global, kelola semua tenant | `/login/admin` |
| **Admin Sekolah** | Dashboard sekolah, kelola siswa/guru/presensi | `/login` |
| **Guru** | Akses terbatas sesuai permission | `/login` |

---

## 2. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  Next.js 15 (App Router) + HeroUI v2 + Tailwind CSS    │
│  SWR untuk data fetching, Phosphor Icons, Framer Motion │
├─────────────────────────────────────────────────────────┤
│                    MIDDLEWARE                            │
│  JWT verification untuk /admin/* routes                 │
│  Cookie-based auth (auth-token, admin-token)            │
├─────────────────────────────────────────────────────────┤
│                    API ROUTES                           │
│  Next.js Route Handlers (/api/*)                        │
│  Auth, CRUD, Billing, Presensi, Notifikasi              │
├─────────────────────────────────────────────────────────┤
│                   DATA LAYER                            │
│  Prisma ORM + PostgreSQL                                │
│  Multi-tenant isolation via tenant_id                   │
├─────────────────────────────────────────────────────────┤
│               EXTERNAL SERVICES                         │
│  Fonnte (WhatsApp API) │ SMTP (Email) │ Vercel (Host)   │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack Detail

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Node.js | 20+ |
| Framework | Next.js (App Router + Turbopack) | 15.5.9 |
| UI Library | HeroUI v2 | 2.8.8 |
| Styling | Tailwind CSS | 4.x |
| Icons | Phosphor React | 1.4.1 |
| Animation | Framer Motion | 11.x |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 6.19.2 |
| Auth | jose (JWT) + bcryptjs | 6.x / 3.x |
| Email | Nodemailer | 8.x |
| WhatsApp | Fonnte API | - |
| Data Fetching | SWR | 2.4.0 |
| QR Code | qrcode.react + html5-qrcode | - |
| Theme | next-themes | 0.4.6 |
| Deploy | Vercel | - |

---

## 3. Struktur Proyek

```
kehadiran.online/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (public)
│   ├── layout.tsx                # Root layout (sidebar, theme, fonts)
│   ├── providers.tsx             # HeroUI + Theme providers
│   ├── error.tsx                 # Global error boundary
│   │
│   ├── login/
│   │   ├── page.tsx              # Login tenant (admin/guru sekolah)
│   │   └── admin/page.tsx        # Login superadmin
│   ├── register/page.tsx         # Registrasi sekolah baru (4 step)
│   │
│   ├── dashboard/page.tsx        # Dashboard utama tenant
│   ├── presensi/page.tsx         # Halaman presensi (QR scan + manual)
│   ├── siswa/page.tsx            # Manajemen siswa (CRUD, import CSV)
│   ├── guru/page.tsx             # Manajemen guru
│   ├── kelas/page.tsx            # Manajemen kelas
│   ├── jadwal/page.tsx           # Pengaturan jadwal per hari
│   ├── kartu-presensi/page.tsx   # Cetak kartu QR siswa
│   ├── laporan/page.tsx          # Laporan presensi + export
│   ├── notifikasi/page.tsx       # Log notifikasi WhatsApp
│   ├── billing/page.tsx          # Billing & subscription
│   ├── settings/page.tsx         # Pengaturan akun tenant
│   │
│   ├── admin/                    # Panel Superadmin
│   │   ├── page.tsx              # Dashboard superadmin
│   │   ├── tenants/page.tsx      # Kelola sekolah (CRUD + delete)
│   │   ├── users/page.tsx        # Kelola semua user
│   │   ├── subscriptions/page.tsx# Kelola langganan
│   │   ├── invoices/page.tsx     # Kelola invoice
│   │   ├── pricing/page.tsx      # Kelola pricing plans
│   │   ├── smtp/page.tsx         # Konfigurasi SMTP
│   │   ├── whatsapp/page.tsx     # Konfigurasi WhatsApp (Fonnte)
│   │   ├── email-logs/page.tsx   # Log email terkirim
│   │   ├── audit/page.tsx        # Audit log aktivitas
│   │   ├── security/page.tsx     # Pengaturan keamanan
│   │   └── settings/page.tsx     # Profil & password superadmin
│   │
│   └── api/                      # API Route Handlers
│       ├── auth/                 # Autentikasi
│       │   ├── login/            # POST - Login tenant
│       │   ├── logout/           # POST - Logout tenant
│       │   ├── admin-login/      # POST - Login superadmin
│       │   ├── admin-logout/     # POST - Logout superadmin
│       │   ├── register/         # POST - Registrasi sekolah
│       │   ├── verify-otp/       # POST - Verifikasi OTP email
│       │   ├── resend-otp/       # POST - Kirim ulang OTP
│       │   ├── choose-plan/      # POST - Pilih paket setelah verifikasi
│       │   └── me/               # GET  - Data user yang login
│       │
│       ├── dashboard/stats/      # GET  - Statistik dashboard
│       ├── presensi/             # GET/POST - CRUD presensi
│       │   ├── scan/             # POST - Scan QR presensi
│       │   ├── pulang/           # POST - Scan QR pulang
│       │   ├── recent/           # GET  - Presensi terbaru
│       │   └── stats/            # GET  - Statistik presensi
│       │
│       ├── siswa/                # GET/POST - CRUD siswa
│       │   ├── [id]/             # GET/PUT/DELETE - Detail siswa
│       │   ├── import/           # POST - Import CSV
│       │   ├── export/           # GET  - Export CSV
│       │   └── stats/            # GET  - Statistik siswa
│       │
│       ├── guru/                 # GET/POST - CRUD guru
│       │   ├── [id]/             # GET/PUT/DELETE
│       │   └── stats/            # GET  - Statistik guru
│       │
│       ├── kelas/                # GET/POST - CRUD kelas
│       │   ├── [id]/             # GET/PUT/DELETE
│       │   └── stats/            # GET  - Statistik kelas
│       │
│       ├── jadwal/               # GET  - List jadwal
│       │   └── bulk/             # PUT  - Update jadwal bulk
│       │
│       ├── laporan/              # GET  - Data laporan
│       │   └── export/           # GET  - Export laporan CSV
│       │
│       ├── notifikasi/           # GET  - Log notifikasi
│       │   └── stats/            # GET  - Statistik notifikasi
│       │
│       ├── billing/
│       │   ├── subscription/     # GET  - Data langganan aktif
│       │   ├── invoices/         # GET  - Riwayat invoice
│       │   └── upgrade/          # POST - Upgrade paket
│       │
│       ├── settings/             # GET/PUT - Pengaturan tenant
│       ├── pricing-plans/        # GET  - List pricing plans (public)
│       │
│       ├── cron/
│       │   └── expire-trials/    # POST - Cron job expire free trials
│       │
│       └── admin/                # Superadmin API
│           ├── overview/         # GET  - Dashboard stats
│           ├── tenants/          # GET/POST - CRUD tenant
│           │   └── [id]/         # GET/PUT/DELETE (cascade delete)
│           ├── users/            # GET
│           │   └── [id]/         # GET/PUT/DELETE
│           ├── subscriptions/    # GET
│           │   └── [id]/         # PUT
│           ├── invoices/         # GET
│           │   └── [id]/         # PUT
│           ├── pricing-plans/    # GET/POST
│           │   └── [id]/         # PUT/DELETE
│           ├── smtp/             # GET/POST
│           │   ├── [id]/         # PUT/DELETE
│           │   └── test/         # POST - Test SMTP
│           ├── send-email/       # POST - Kirim email manual
│           ├── email-templates/  # GET/POST
│           │   └── [id]/         # PUT/DELETE
│           ├── email-logs/       # GET
│           ├── audit-logs/       # GET
│           ├── whatsapp/test/    # POST - Test WhatsApp
│           └── settings/         # GET/PUT
│               ├── profile/      # PUT
│               └── password/     # PUT
│
├── components/
│   ├── sidebar.tsx               # Sidebar navigasi tenant
│   ├── admin-sidebar.tsx         # Sidebar navigasi superadmin
│   ├── top-bar.tsx               # Top bar dengan breadcrumb & user menu
│   ├── delete-modal.tsx          # Modal konfirmasi hapus reusable
│   ├── theme-switch.tsx          # Toggle dark/light mode
│   ├── icons.tsx                 # Custom icon components
│   └── ui/                       # UI primitives (marquee, highlighter, etc.)
│
├── hooks/
│   └── use-swr-hooks.ts         # SWR hooks untuk semua data fetching
│
├── lib/
│   ├── prisma.ts                # Prisma client singleton
│   ├── auth.ts                  # Helper auth (requireAuth, requireTenantAuth)
│   ├── email.ts                 # Email service (Nodemailer + template rendering)
│   ├── whatsapp.ts              # WhatsApp service (Fonnte API + queue)
│   ├── fetcher.ts               # SWR fetcher function
│   └── utils.ts                 # Utility functions (cn)
│
├── prisma/
│   ├── schema.prisma            # Database schema (20+ models)
│   ├── seed.ts                  # Seed superadmin + demo tenant
│   ├── seed-pricing-plans.ts    # Seed pricing plans
│   ├── seed-demo.ts             # Seed demo account dengan sample data
│   └── seed-email-templates.ts  # Seed email templates
│
├── middleware.ts                 # JWT auth middleware untuk /admin/*
├── .env                          # Environment variables
├── tailwind.config.ts           # Tailwind configuration
├── next.config.js               # Next.js configuration
└── eslint.config.mjs            # ESLint flat config
```

---

## 4. Database Schema

Platform menggunakan PostgreSQL dengan Prisma ORM. Berikut adalah seluruh model dan relasinya:

### 4.1 Model Utama

#### Tenant (Sekolah)
Entitas utama multi-tenancy. Setiap sekolah = 1 tenant.

| Field | Type | Keterangan |
|-------|------|------------|
| id | String (cuid) | Primary key |
| nama_sekolah | VarChar(100) | Nama sekolah |
| slug | VarChar(50) | URL-friendly identifier, unique |
| custom_domain | VarChar(255) | Custom domain (opsional) |
| alamat | Text | Alamat sekolah |
| nomor_telepon | VarChar(20) | Telepon sekolah |
| email | VarChar(100) | Email sekolah |
| logo | VarChar(255) | Path logo |
| qr_mode | VarChar(20) | Mode QR: `gate_only`, `class_only`, `flexible` |
| is_active | Boolean | Status aktif tenant |

**Relasi:** users, kelas, siswa, jadwal, presensi, notifikasi, settings, gurus, subscription, invoices, audit_logs, api_keys, feature_quota, invites

#### User
Pengguna yang bisa login (superadmin, admin sekolah, guru).

| Field | Type | Keterangan |
|-------|------|------------|
| id | String (cuid) | Primary key |
| tenant_id | String? | Null untuk superadmin |
| username | VarChar(50) | Unique |
| email | VarChar(100) | Unique |
| password_hash | VarChar(255) | Bcrypt hash |
| role | VarChar(20) | `superadmin`, `admin`, `guru` |
| nama_lengkap | VarChar(100) | Nama lengkap |
| email_verified | Boolean | Status verifikasi email |
| otp_code | VarChar(6) | Kode OTP untuk verifikasi |
| otp_expires_at | DateTime | Waktu kedaluwarsa OTP |
| is_active | Boolean | Status aktif |

#### Siswa
Data siswa dengan informasi orang tua terintegrasi.

| Field | Type | Keterangan |
|-------|------|------------|
| nisn | VarChar(20) | NISN, unique per tenant |
| nis | VarChar(20) | NIS, unique per tenant |
| nama_lengkap | VarChar(100) | Nama siswa |
| jenis_kelamin | VarChar(1) | `L` atau `P` |
| kelas_id | String | FK ke Kelas |
| qr_code | VarChar(255) | QR code unik per siswa |
| status | VarChar(20) | `aktif`, `lulus`, `pindah`, `keluar` |
| nama_ayah | VarChar(100) | Nama ayah |
| nomor_wa_ayah | VarChar(20) | WhatsApp ayah (format: 6281xxx) |
| nama_ibu | VarChar(100) | Nama ibu |
| nomor_wa_ibu | VarChar(20) | WhatsApp ibu |
| preferensi_notifikasi | VarChar(10) | `ayah`, `ibu`, `keduanya` |

#### Kelas

| Field | Type | Keterangan |
|-------|------|------------|
| nama_kelas | VarChar(20) | Contoh: `XII RPL 1` |
| tingkat | VarChar(10) | `X`, `XI`, `XII` |
| jurusan | VarChar(50) | `RPL`, `TKJ`, `MM`, dll |
| tahun_ajaran | VarChar(20) | `2025/2026` |
| semester | VarChar(10) | `ganjil` atau `genap` |
| qr_code | VarChar(255) | QR kelas (jika qr_mode = class_only) |

**Unique constraint:** `[tenant_id, nama_kelas, tahun_ajaran, semester]`

#### Guru

| Field | Type | Keterangan |
|-------|------|------------|
| nip | VarChar(20) | NIP guru |
| nama_guru | VarChar(100) | Nama guru |
| user_id | String? | FK ke User (jika punya akun login) |
| nomor_wa | VarChar(20) | WhatsApp guru |

#### Jadwal

| Field | Type | Keterangan |
|-------|------|------------|
| hari | VarChar(10) | `senin` s/d `minggu` |
| jam_masuk | VarChar(5) | Format: `07:00` |
| jam_pulang | VarChar(5) | Format: `15:00` |
| is_active | Boolean | Apakah hari ini aktif |

**Unique constraint:** `[tenant_id, hari]`

#### Presensi

| Field | Type | Keterangan |
|-------|------|------------|
| siswa_id | String | FK ke Siswa |
| jadwal_id | String | FK ke Jadwal |
| tanggal | Date | Tanggal presensi |
| waktu_masuk | DateTime? | Waktu scan masuk |
| waktu_pulang | DateTime? | Waktu scan pulang |
| status_masuk | VarChar(20) | `hadir`, `terlambat`, `alpha`, `izin`, `sakit` |
| status_pulang | VarChar(20)? | `pulang`, `tidak_pulang` |
| metode_input | VarChar(20) | `qr_code`, `fingerprint`, `manual` |
| keterangan | Text? | Alasan izin/sakit |
| input_by | String? | User ID yang input manual |

**Unique constraint:** `[tenant_id, siswa_id, tanggal]` — satu siswa hanya bisa punya 1 record presensi per hari.

#### Notifikasi (Log WhatsApp)

| Field | Type | Keterangan |
|-------|------|------------|
| siswa_id | String | FK ke Siswa |
| presensi_id | String? | FK ke Presensi |
| nomor_tujuan | VarChar(20) | Nomor WA tujuan |
| jenis_notifikasi | VarChar(50) | `presensi_hadir`, `presensi_terlambat`, `presensi_alpha`, `presensi_pulang` |
| pesan | Text | Isi pesan yang dikirim |
| status | VarChar(20) | `pending`, `sent`, `failed`, `delivered` |

### 4.2 Model Billing

#### Subscription
Satu tenant = satu subscription aktif.

| Field | Type | Keterangan |
|-------|------|------------|
| tenant_id | String (unique) | FK ke Tenant |
| plan | VarChar(50) | `free_trial`, `starter`, `pro`, `enterprise` |
| status | VarChar(20) | `active`, `canceled`, `past_due`, `expired` |
| billing_cycle | VarChar(20) | `monthly`, `annual` |
| amount | Decimal | Total biaya |

#### Invoice

| Field | Type | Keterangan |
|-------|------|------------|
| invoice_number | VarChar(50) | Nomor invoice unik |
| amount | Decimal | Jumlah tagihan |
| status | VarChar(20) | `draft`, `sent`, `paid`, `failed`, `cancelled` |
| payment_method | VarChar(50) | Metode pembayaran |

#### PricingPlan
Dikelola superadmin, ditampilkan saat registrasi dan upgrade.

| Field | Type | Keterangan |
|-------|------|------------|
| key | VarChar(50) | `starter`, `pro`, `enterprise` |
| price_per_siswa | Decimal | Harga per siswa per bulan |
| original_price | Decimal? | Harga coret (promo) |
| min_siswa / max_siswa | Int | Range siswa |
| max_guru / max_kelas | Int | Batas guru dan kelas |
| sms_quota | Int | Kuota WA per bulan |
| features | Json | Array fitur untuk ditampilkan |
| is_popular | Boolean | Tandai sebagai "Populer" |

#### FeatureQuota
Kuota aktual per tenant (dibuat saat choose-plan).

| Field | Type | Keterangan |
|-------|------|------------|
| tenant_id | String (unique) | FK ke Tenant |
| max_siswa | Int | Batas siswa |
| max_guru | Int | Batas guru |
| max_kelas | Int | Batas kelas |
| sms_quota | Int | Kuota WA/bulan |

### 4.3 Model Global (Superadmin)

| Model | Fungsi |
|-------|--------|
| **GlobalSetting** | Pengaturan global (WhatsApp API key, device token, template pesan) |
| **SmtpConfig** | Konfigurasi SMTP untuk kirim email (bisa multiple, ada default) |
| **EmailTemplate** | Template email (registrasi, reset password, dll) dengan variabel |
| **EmailLog** | Log semua email yang dikirim |
| **AuditLog** | Log aktivitas user (login, CRUD, dll) |
| **ApiKey** | API key per tenant untuk integrasi |
| **Permission** | Definisi permission (resource + action) |
| **Invite** | Undangan user baru ke tenant |

---

## 5. Autentikasi & Otorisasi

### 5.1 Mekanisme Auth

Platform menggunakan **JWT (JSON Web Token)** yang disimpan di **httpOnly cookie**.

```
Login → Verify password → Generate JWT → Set cookie → Redirect
```

Ada 2 jenis token/cookie:

| Cookie | Untuk | Expiry |
|--------|-------|--------|
| `auth-token` | Admin/Guru sekolah | 8 jam |
| `admin-token` | Superadmin | 8 jam |

### 5.2 JWT Payload

```json
{
  "sub": "user_id",
  "email": "user@email.com",
  "role": "admin",
  "tenantId": "tenant_id"
}
```

### 5.3 Middleware

File `middleware.ts` melindungi route `/admin/*`:

1. Cek cookie `admin-token`
2. Verify JWT signature
3. Pastikan `role === "superadmin"`
4. Jika gagal → redirect ke `/login/admin`

### 5.4 API Auth Helpers

File `lib/auth.ts` menyediakan helper functions:

- **`requireAuth(request)`** — Verify JWT dari cookie, return `{ userId, email, role, tenantId }`
- **`requireTenantAuth(request)`** — Sama seperti di atas, tapi pastikan `tenantId` ada (bukan superadmin)

Setiap API route yang butuh auth memanggil helper ini di awal.

### 5.5 Password Hashing

Menggunakan `bcryptjs` dengan salt rounds = 12.

---

## 6. Alur Registrasi Sekolah

Registrasi dilakukan dalam **4 langkah** di halaman `/register`:

### Step 1: Data Admin
User mengisi:
- Nama lengkap
- Email
- Nomor telepon
- Password + konfirmasi

### Step 2: Data Sekolah
User mengisi:
- Nama sekolah
- Jenjang (SD/SMP/SMA/SMK)
- Alamat
- Nomor telepon sekolah

**Action:** Panggil `POST /api/auth/register`

Yang terjadi di backend:
1. Validasi data
2. Cek apakah email sudah terdaftar (jika sudah tapi belum verified, izinkan re-register)
3. Generate slug dari nama sekolah
4. Hash password
5. Buat Tenant (is_active = false)
6. Buat User (email_verified = false, role = admin)
7. Generate OTP 6 digit
8. Kirim OTP ke email via SMTP
9. Return success

### Step 3: Verifikasi OTP
User memasukkan kode OTP 6 digit yang dikirim ke email.

**Action:** Panggil `POST /api/auth/verify-otp`

Yang terjadi:
1. Cari user by email
2. Cek OTP code dan expiry
3. Set `email_verified = true`
4. Hapus OTP code
5. Return success

Jika OTP expired, user bisa klik **Kirim Ulang** → `POST /api/auth/resend-otp`

### Step 4: Pilih Paket
Menampilkan semua pricing plans dari database (`GET /api/pricing-plans`).

**Action:** Panggil `POST /api/auth/choose-plan`

Yang terjadi:
1. Cari user by email
2. Cari tenant
3. Aktifkan tenant (`is_active = true`)
4. Buat Subscription record
5. Buat FeatureQuota record berdasarkan plan yang dipilih
6. Generate JWT token
7. Set cookie `auth-token`
8. Return success → redirect ke `/dashboard`

```
[Step 1: Admin] → [Step 2: Sekolah] → POST /register
                                            ↓
                                    Buat Tenant + User (inactive)
                                    Kirim OTP email
                                            ↓
                  [Step 3: OTP] → POST /verify-otp
                                            ↓
                                    Verify email
                                            ↓
                  [Step 4: Plan] → POST /choose-plan
                                            ↓
                                    Activate tenant
                                    Create subscription + quota
                                    Auto-login → /dashboard
```

---

## 7. Alur Presensi

### 7.1 Presensi Masuk via QR Code

Halaman `/presensi` memiliki QR scanner menggunakan `html5-qrcode`.

**Alur:**

1. Admin/guru membuka halaman presensi
2. Klik tab "QR Scan"
3. Kamera aktif, scan QR code siswa
4. Frontend mengirim `POST /api/presensi/scan` dengan `qr_code`

**Backend logic (`/api/presensi/scan`):**

```
1. Decode QR → cari Siswa by qr_code + tenant_id
2. Cari Jadwal hari ini
3. Cek apakah sudah ada presensi hari ini
   - Jika sudah ada → return error "Sudah presensi"
4. Tentukan status:
   - waktu_masuk <= jam_masuk → "hadir"
   - waktu_masuk > jam_masuk → "terlambat"
5. Buat record Presensi
6. Fire-and-forget: kirim notifikasi WA ke orang tua
7. Return success + data presensi
```

### 7.2 Presensi Pulang via QR Code

**Endpoint:** `POST /api/presensi/pulang`

```
1. Decode QR → cari Siswa
2. Cari presensi hari ini yang belum ada waktu_pulang
3. Update waktu_pulang dan status_pulang = "pulang"
4. Fire-and-forget: kirim notifikasi WA pulang
5. Return success
```

### 7.3 Presensi Manual

Admin bisa input presensi manual dari halaman `/presensi` tab "Manual".

**Endpoint:** `POST /api/presensi`

```json
{
  "siswa_id": "...",
  "jadwal_id": "...",
  "tanggal": "2026-02-16",
  "status_masuk": "hadir",
  "keterangan": "..."
}
```

Notifikasi WA dikirim untuk status `hadir`, `terlambat`, dan `alpha`. Status `sakit` dan `izin` **tidak** mengirim WA.

### 7.4 Status Presensi

| Status | Keterangan | Trigger WA |
|--------|------------|------------|
| `hadir` | Hadir tepat waktu | Ya |
| `terlambat` | Hadir setelah jam masuk | Ya |
| `alpha` | Tidak hadir tanpa keterangan | Ya |
| `izin` | Tidak hadir dengan izin | Tidak |
| `sakit` | Tidak hadir karena sakit | Tidak |
| `pulang` | Sudah pulang | Ya |

---

## 8. Notifikasi WhatsApp

### 8.1 Arsitektur

WhatsApp notification menggunakan **Fonnte API** dengan arsitektur:

```
Presensi Event → sendPresensiNotification() → Global Queue → Fonnte API
                                                    ↓
                                            Rate limit: 1 msg / 2 detik
                                            Typing indicator sebelum kirim
```

### 8.2 Konfigurasi

Disimpan di `GlobalSetting` (dikelola superadmin di `/admin/whatsapp`):

| Key | Keterangan |
|-----|------------|
| `wa_api_url` | URL Fonnte API (`https://api.fonnte.com/send`) |
| `wa_device_token` | Token device Fonnte |
| `wa_template_hadir` | Template pesan hadir |
| `wa_template_terlambat` | Template pesan terlambat |
| `wa_template_alpha` | Template pesan alpha |
| `wa_template_pulang` | Template pesan pulang |

### 8.3 Template Variables

Template pesan mendukung variabel:

| Variable | Nilai |
|----------|-------|
| `{nama}` | Nama siswa |
| `{kelas}` | Nama kelas |
| `{waktu}` | Waktu presensi |
| `{tanggal}` | Tanggal presensi |
| `{status}` | Status presensi |
| `{sekolah}` | Nama sekolah |

**Contoh template:**
```
Assalamualaikum, Bapak/Ibu wali dari {nama} ({kelas}).

Kami informasikan bahwa anak Anda telah hadir di {sekolah} pada {tanggal} pukul {waktu}.

Terima kasih.
— {sekolah}
```

### 8.4 Rate-Limited Queue

File `lib/whatsapp.ts` mengimplementasikan global queue:

- **Rate limit:** 1 pesan per 2 detik (menghindari block dari Fonnte)
- **Typing indicator:** Sebelum kirim pesan, API `/typing` dipanggil dulu agar terlihat natural
- **Fire-and-forget:** Presensi API tidak menunggu WA selesai dikirim
- **Concurrency safe:** Queue memproses satu per satu

### 8.5 Alur Pengiriman

```
1. sendPresensiNotification(tenantId, siswaId, presensiId, status)
2. Ambil data siswa (nama, kelas, nomor WA orang tua, preferensi)
3. Ambil template dari GlobalSetting
4. Replace variabel dalam template
5. Tentukan nomor tujuan berdasarkan preferensi_notifikasi:
   - "ayah" → kirim ke nomor_wa_ayah
   - "ibu" → kirim ke nomor_wa_ibu
   - "keduanya" → kirim ke kedua nomor
6. Masukkan ke queue
7. Queue memproses:
   a. POST /typing ke Fonnte (typing indicator)
   b. Tunggu 1 detik
   c. POST /send ke Fonnte (kirim pesan)
   d. Simpan log ke tabel Notifikasi
   e. Tunggu 2 detik sebelum pesan berikutnya
```

---

## 9. Sistem Email

### 9.1 Konfigurasi SMTP

Superadmin bisa mengelola multiple SMTP config di `/admin/smtp`. Satu config ditandai sebagai `is_default`.

### 9.2 Email Templates

Template email disimpan di tabel `EmailTemplate` dengan variabel yang bisa di-replace:

| Template Key | Digunakan Untuk |
|-------------|-----------------|
| `registration` | OTP verifikasi saat registrasi |
| `reset_password` | Reset password |
| `payment_success` | Konfirmasi pembayaran |
| `invoice` | Kirim invoice |

### 9.3 Alur Pengiriman Email

```
1. Ambil SmtpConfig yang is_default = true
2. Ambil EmailTemplate by key
3. Replace variabel dalam template
4. Kirim via Nodemailer
5. Log ke tabel EmailLog (status: sent/failed)
```

### 9.4 Email Log

Semua email yang dikirim tercatat di `EmailLog` dan bisa dilihat di `/admin/email-logs`.

---

## 10. Billing & Subscription

### 10.1 Pricing Plans

Terdapat 3 paket utama (dikelola superadmin):

| Plan | Siswa | Guru | Kelas | Harga/Siswa/Bulan |
|------|-------|------|-------|-------------------|
| **Starter** | 1–100 | 20 | 10 | Rp 12.000 |
| **Professional** | 101–500 | 50 | 30 | Rp 10.000 |
| **Enterprise** | 501–5000 | 200 | 100 | Rp 8.999 |

### 10.2 Billing Cycle

- **Bulanan:** Bayar per bulan
- **Tahunan:** Bayar 10 bulan, gratis 2 bulan (hemat 17%)

### 10.3 Alur Upgrade

1. Tenant buka `/billing`
2. Klik "Upgrade" pada paket yang diinginkan
3. Modal muncul → masukkan jumlah siswa
4. Paket otomatis dipilih berdasarkan range siswa
5. Pilih periode (bulanan/tahunan)
6. Klik "Konfirmasi Upgrade"
7. Backend (`POST /api/billing/upgrade`):
   - Update Subscription (plan, amount, billing_cycle)
   - Update FeatureQuota
   - Buat Invoice baru
   - Return success

### 10.4 Free Trial Expiry

Cron job `POST /api/cron/expire-trials` (dipanggil via Vercel Cron):
- Cari subscription dengan plan `free_trial` yang `ended_at < now()`
- Set status = `expired`
- Set tenant `is_active = false`

---

## 11. Panel Superadmin

Diakses via `/login/admin` → `/admin/*`

### 11.1 Dashboard (`/admin`)

Menampilkan:
- Total tenant, user, siswa, guru
- Revenue bulan ini
- Tenant terbaru
- Distribusi subscription per plan

### 11.2 Kelola Sekolah (`/admin/tenants`)

- List semua tenant dengan search & pagination
- Detail: nama, email, plan, status, jumlah siswa/guru
- **Delete tenant** dengan cascade deletion (hapus semua data terkait)
  - Konfirmasi modal: ketik nama sekolah untuk konfirmasi
  - Urutan delete: notifikasi → presensi → siswa → invites → audit_logs → settings → invoices → api_keys → feature_quota → subscription → guru → kelas → jadwal → users → tenant

### 11.3 Kelola User (`/admin/users`)

- List semua user across tenants
- Filter by role, status
- Edit/delete user

### 11.4 Kelola Subscription (`/admin/subscriptions`)

- List semua subscription
- Edit plan, status, tanggal

### 11.5 Kelola Invoice (`/admin/invoices`)

- List semua invoice
- Update status pembayaran

### 11.6 Pricing Plans (`/admin/pricing`)

- CRUD pricing plans
- Set harga, range siswa, fitur, popular flag
- Toggle active/inactive

### 11.7 SMTP Config (`/admin/smtp`)

- CRUD SMTP configurations
- Set default SMTP
- Test kirim email

### 11.8 WhatsApp Config (`/admin/whatsapp`)

- Set Fonnte API URL dan device token
- Edit template pesan (hadir, terlambat, alpha, pulang)
- Test kirim WhatsApp

### 11.9 Email Templates (`/admin` → via API)

- CRUD email templates
- Edit subject dan body HTML
- Variabel yang tersedia per template

### 11.10 Email Logs (`/admin/email-logs`)

- List semua email yang dikirim
- Status: sent, failed, pending
- Detail error jika gagal

### 11.11 Audit Log (`/admin/audit`)

- Log semua aktivitas user
- Filter by action, entity type, user
- Detail: IP address, user agent, changes (before/after)

### 11.12 Security (`/admin/security`)

- Konfigurasi keamanan platform
- JWT settings, session timeout

### 11.13 Settings (`/admin/settings`)

- Edit profil superadmin
- Ganti password

---

## 12. Panel Tenant (Sekolah)

Diakses via `/login` → `/dashboard/*`

### 12.1 Dashboard (`/dashboard`)

- Statistik hari ini: total siswa, hadir, terlambat, alpha
- Persentase kehadiran
- Aktivitas presensi terbaru (live feed)
- Chart kehadiran mingguan

### 12.2 Presensi (`/presensi`)

**Tab QR Scan:**
- Buka kamera → scan QR siswa
- Otomatis catat presensi masuk/pulang
- Feedback visual + suara

**Tab Manual:**
- Pilih siswa dari dropdown
- Pilih status (hadir/terlambat/alpha/izin/sakit)
- Input keterangan jika perlu

**Tab Riwayat:**
- List presensi hari ini
- Filter by kelas, status
- Statistik ringkasan

### 12.3 Siswa (`/siswa`)

- Tabel siswa dengan search, filter kelas, pagination
- Tambah siswa manual (form lengkap termasuk data orang tua)
- Edit & hapus siswa
- **Import CSV** — upload file CSV untuk bulk import
- **Export CSV** — download data siswa
- Statistik: total, per kelas, per jenis kelamin

### 12.4 Guru (`/guru`)

- Tabel guru dengan search & pagination
- CRUD guru (NIP, nama, email, WA, foto)
- Statistik guru

### 12.5 Kelas (`/kelas`)

- List kelas per tahun ajaran & semester
- CRUD kelas (nama, tingkat, jurusan, kapasitas)
- Detail kelas: list siswa di kelas tersebut

### 12.6 Jadwal (`/jadwal`)

- Tabel jadwal Senin–Minggu
- Edit jam masuk & jam pulang per hari
- Toggle aktif/nonaktif per hari
- Bulk update semua jadwal sekaligus

### 12.7 Kartu Presensi (`/kartu-presensi`)

- Generate kartu QR per siswa
- Pilih kelas → tampilkan semua siswa
- Download kartu sebagai gambar (PNG)
- Kartu berisi: foto, nama, NISN, kelas, QR code

### 12.8 Laporan (`/laporan`)

- Filter: rentang tanggal, kelas, status
- Tabel laporan presensi
- Statistik: total hadir, terlambat, alpha, izin, sakit
- **Export CSV** — download laporan

### 12.9 Notifikasi (`/notifikasi`)

- Log semua notifikasi WhatsApp yang dikirim
- Status: sent, failed, pending
- Detail: nomor tujuan, pesan, waktu kirim

### 12.10 Billing (`/billing`)

- Info paket aktif (plan, harga, masa berlaku)
- Daftar paket tersedia
- Modal upgrade paket
- Riwayat pembayaran (invoice)

### 12.11 Settings (`/settings`)

- Edit profil admin (nama, email, telepon)
- Ganti password
- Pengaturan sekolah

---

## 13. API Reference

### 13.1 Auth

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrasi sekolah baru | Public |
| POST | `/api/auth/verify-otp` | Verifikasi OTP email | Public |
| POST | `/api/auth/resend-otp` | Kirim ulang OTP | Public |
| POST | `/api/auth/choose-plan` | Pilih paket + aktivasi | Public |
| POST | `/api/auth/login` | Login tenant | Public |
| POST | `/api/auth/logout` | Logout tenant | Token |
| POST | `/api/auth/admin-login` | Login superadmin | Public |
| POST | `/api/auth/admin-logout` | Logout superadmin | Token |
| GET | `/api/auth/me` | Data user yang login | Token |

### 13.2 Presensi

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/presensi` | List presensi (filter) | Tenant |
| POST | `/api/presensi` | Input presensi manual | Tenant |
| POST | `/api/presensi/scan` | Scan QR presensi masuk | Tenant |
| POST | `/api/presensi/pulang` | Scan QR presensi pulang | Tenant |
| GET | `/api/presensi/recent` | Presensi terbaru | Tenant |
| GET | `/api/presensi/stats` | Statistik presensi | Tenant |

### 13.3 Data Master

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET/POST | `/api/siswa` | List/tambah siswa | Tenant |
| GET/PUT/DELETE | `/api/siswa/[id]` | Detail/edit/hapus siswa | Tenant |
| POST | `/api/siswa/import` | Import CSV siswa | Tenant |
| GET | `/api/siswa/export` | Export CSV siswa | Tenant |
| GET | `/api/siswa/stats` | Statistik siswa | Tenant |
| GET/POST | `/api/guru` | List/tambah guru | Tenant |
| GET/PUT/DELETE | `/api/guru/[id]` | Detail/edit/hapus guru | Tenant |
| GET | `/api/guru/stats` | Statistik guru | Tenant |
| GET/POST | `/api/kelas` | List/tambah kelas | Tenant |
| GET/PUT/DELETE | `/api/kelas/[id]` | Detail/edit/hapus kelas | Tenant |
| GET | `/api/kelas/stats` | Statistik kelas | Tenant |
| GET | `/api/jadwal` | List jadwal | Tenant |
| PUT | `/api/jadwal/bulk` | Update jadwal bulk | Tenant |

### 13.4 Laporan & Notifikasi

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/laporan` | Data laporan presensi | Tenant |
| GET | `/api/laporan/export` | Export laporan CSV | Tenant |
| GET | `/api/notifikasi` | Log notifikasi WA | Tenant |
| GET | `/api/notifikasi/stats` | Statistik notifikasi | Tenant |

### 13.5 Billing

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/billing/subscription` | Data langganan aktif | Tenant |
| GET | `/api/billing/invoices` | Riwayat invoice | Tenant |
| POST | `/api/billing/upgrade` | Upgrade paket | Tenant |
| GET | `/api/pricing-plans` | List pricing plans | Public |

### 13.6 Superadmin

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/overview` | Dashboard stats |
| GET/POST | `/api/admin/tenants` | List/tambah tenant |
| GET/PUT/DELETE | `/api/admin/tenants/[id]` | Detail/edit/hapus tenant (cascade) |
| GET | `/api/admin/users` | List semua user |
| GET/PUT/DELETE | `/api/admin/users/[id]` | Detail/edit/hapus user |
| GET | `/api/admin/subscriptions` | List subscription |
| PUT | `/api/admin/subscriptions/[id]` | Edit subscription |
| GET | `/api/admin/invoices` | List invoice |
| PUT | `/api/admin/invoices/[id]` | Edit invoice |
| GET/POST | `/api/admin/pricing-plans` | List/tambah pricing plan |
| PUT/DELETE | `/api/admin/pricing-plans/[id]` | Edit/hapus pricing plan |
| GET/POST | `/api/admin/smtp` | List/tambah SMTP config |
| PUT/DELETE | `/api/admin/smtp/[id]` | Edit/hapus SMTP config |
| POST | `/api/admin/smtp/test` | Test kirim email |
| POST | `/api/admin/send-email` | Kirim email manual |
| GET/POST | `/api/admin/email-templates` | List/tambah email template |
| PUT/DELETE | `/api/admin/email-templates/[id]` | Edit/hapus template |
| GET | `/api/admin/email-logs` | Log email |
| GET | `/api/admin/audit-logs` | Audit log |
| POST | `/api/admin/whatsapp/test` | Test kirim WhatsApp |
| GET/PUT | `/api/admin/settings` | Pengaturan global |
| PUT | `/api/admin/settings/profile` | Edit profil superadmin |
| PUT | `/api/admin/settings/password` | Ganti password superadmin |

### 13.7 Cron

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/cron/expire-trials` | Expire free trial yang sudah habis |

---

## 14. Middleware & Security

### 14.1 Route Protection

```
middleware.ts
├── /admin/*  → Cek admin-token cookie → Verify JWT → role === "superadmin"
└── Lainnya   → Pass through (API routes handle auth sendiri)
```

### 14.2 API Route Auth

Setiap API route yang butuh auth memanggil:

```typescript
// Untuk API tenant
const { tenantId, userId } = await requireTenantAuth(request);

// Untuk API superadmin
const { userId, role } = await requireAuth(request);
if (role !== "superadmin") return 403;
```

### 14.3 Multi-Tenant Isolation

Semua query database di-filter by `tenant_id`:

```typescript
const siswa = await prisma.siswa.findMany({
  where: { tenant_id: tenantId }
});
```

Ini memastikan tenant A tidak bisa mengakses data tenant B.

### 14.4 Password Security

- Hash: bcryptjs dengan 12 salt rounds
- Minimum password length enforced di frontend
- OTP: 6 digit, expires dalam 10 menit

### 14.5 Cookie Security

```typescript
response.cookies.set("auth-token", token, {
  httpOnly: true,          // Tidak bisa diakses JavaScript
  secure: true,            // Hanya HTTPS (production)
  sameSite: "lax",         // CSRF protection
  path: "/",
  maxAge: 60 * 60 * 8,    // 8 jam
});
```

---

## 15. Deployment

### 15.1 Vercel

Platform di-deploy ke Vercel dengan konfigurasi:

- **Framework:** Next.js (auto-detected)
- **Build command:** `npm run build`
- **Output:** `.next/`
- **Node.js:** 20.x

### 15.2 Database

PostgreSQL di-host terpisah (Neon, Supabase, atau self-hosted). Connection string via `DATABASE_URL`.

### 15.3 Vercel Cron

Untuk expire free trials, tambahkan di `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/expire-trials",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## 16. Seeder & Demo

### 16.1 Seed Utama (`prisma/seed.ts`)

```bash
npx tsx prisma/seed.ts
```

Membuat:
- Superadmin: `super@kehadiran.online` / `Kehadiran2026online!`
- Demo tenant: SMA Demo Kehadiran
- Admin tenant: `admin@sma-demo.sch.id` / `Admin123!`
- Subscription, invoice, audit logs, email logs, SMTP config

### 16.2 Seed Pricing Plans (`prisma/seed-pricing-plans.ts`)

```bash
npx tsx prisma/seed-pricing-plans.ts
```

Membuat 3 pricing plans: Starter, Professional, Enterprise.

### 16.3 Seed Email Templates (`prisma/seed-email-templates.ts`)

```bash
npx tsx prisma/seed-email-templates.ts
```

Membuat template email untuk registrasi, reset password, dll.

### 16.4 Seed Demo Account (`prisma/seed-demo.ts`)

```bash
npx tsx prisma/seed-demo.ts
```

Membuat akun demo lengkap:
- **Login:** `demo@kehadiran.online` / `demokehadiran`
- Tenant: SMK Negeri 1 Demo
- 6 kelas (X/XI/XII RPL & TKJ)
- 5 guru dengan data kontak
- 24 siswa dengan data orang tua dan nomor WA
- Jadwal Senin–Sabtu
- 7 hari riwayat presensi (distribusi realistis)
- Presensi hari ini (partial, simulasi ongoing)
- Subscription Pro aktif 1 tahun

Semua seeder menggunakan `upsert` sehingga aman dijalankan berulang kali.

---

## 17. Environment Variables

Buat file `.env` di root project:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/kehadiran?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# App
NEXT_PUBLIC_APP_URL="https://kehadiran.online"

# Fonnte WhatsApp API (opsional, bisa diset via admin panel)
FONNTE_API_URL="https://api.fonnte.com/send"
FONNTE_DEVICE_TOKEN="your-fonnte-device-token"

# Vercel Cron Secret (opsional)
CRON_SECRET="your-cron-secret"
```

> **Catatan:** Konfigurasi SMTP dan WhatsApp juga bisa dikelola via panel superadmin tanpa perlu environment variable.

---

## Lisensi

MIT License — Copyright (c) 2026 [PT CORE SOLUTION DIGITAL](https://www.coresolution.digital/)

Lihat file [LICENSE](./LICENSE) untuk detail lengkap.
