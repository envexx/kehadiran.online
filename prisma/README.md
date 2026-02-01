# Prisma Database Schema - Kehadiran

## 📋 Overview

Schema database untuk sistem presensi **Kehadiran** dengan dukungan multi-tenant.

## 🗄️ Models

### 1. **Tenant** - Multi-tenant Support
Setiap sekolah yang mendaftar memiliki tenant_id sendiri untuk isolasi data.

### 2. **User** - Admin & Guru
User yang bisa login ke sistem (admin atau guru).

### 3. **Guru** - Data Guru (Disederhanakan)
- NIP/Username/Email
- Nama Guru
- Terhubung dengan User (opsional)

### 4. **Kelas** - Data Kelas
Kelas per tenant dengan tahun ajaran dan semester.

### 5. **Siswa** - Data Siswa + Orang Tua
**Data Orang Tua digabung dalam tabel Siswa:**
- `nama_ayah` + `nomor_wa_ayah`
- `nama_ibu` + `nomor_wa_ibu`
- `preferensi_notifikasi` (ayah/ibu/keduanya)

### 6. **Jadwal** - Jam Masuk & Pulang
**Hanya jam masuk dan pulang per hari (7 hari):**
- `hari`: senin, selasa, rabu, kamis, jumat, sabtu, minggu
- `jam_masuk`: Format '07:00'
- `jam_pulang`: Format '15:00'

### 7. **Presensi** - Data Presensi
- `waktu_masuk` & `waktu_pulang` (terpisah)
- `status_masuk`: hadir, terlambat, alpha
- `status_pulang`: pulang, tidak_pulang
- Terhubung dengan `jadwal_id` untuk tahu hari dan jam

### 8. **Notifikasi** - Log WhatsApp
Log semua notifikasi yang dikirim ke orang tua.

### 9. **Setting** - Pengaturan per Tenant
Settings untuk setiap tenant (WhatsApp API, notifikasi, dll).

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install prisma @prisma/client
```

### 2. Setup Database URL
Edit file `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kehadiran?schema=public"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Migration
```bash
npx prisma migrate dev --name init
```

### 5. (Optional) Seed Database
```bash
npx prisma db seed
```

## 📝 Contoh Query

### Get Presensi dengan Filter Tenant
```typescript
const presensi = await prisma.presensi.findMany({
  where: {
    tenant_id: currentTenantId,
    tanggal: new Date(),
  },
  include: {
    siswa: {
      include: {
        kelas: true,
      },
    },
    jadwal: true,
  },
});
```

### Get Siswa dengan Data Orang Tua
```typescript
const siswa = await prisma.siswa.findUnique({
  where: {
    id: siswaId,
    tenant_id: currentTenantId,
  },
  include: {
    kelas: true,
  },
});

// Data orang tua sudah ada di:
// siswa.nama_ayah, siswa.nomor_wa_ayah
// siswa.nama_ibu, siswa.nomor_wa_ibu
```

### Get Jadwal untuk Hari Ini
```typescript
const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();
const jadwal = await prisma.jadwal.findUnique({
  where: {
    tenant_id_hari: {
      tenant_id: currentTenantId,
      hari: hariIni,
    },
  },
});
```

## 🔔 Flow Presensi

1. **Siswa Scan QR Code** → Sistem cek `jadwal` berdasarkan hari
2. **Cek Jam** → Bandingkan dengan `jam_masuk` dan `jam_pulang`
3. **Jika sebelum jam_masuk** → Presensi masuk
4. **Jika setelah jam_pulang** → Presensi pulang
5. **Simpan ke `presensi`** dengan `waktu_masuk` atau `waktu_pulang`
6. **Kirim Notifikasi** → Ambil nomor WA dari `siswa.nomor_wa_ayah` atau `siswa.nomor_wa_ibu`
7. **Log ke `notifikasi`**

## 📱 Format Nomor WhatsApp

- Format: `6281234567890` (tanpa +, tanpa spasi, tanpa 0 di depan)
- Kode negara: `62` (Indonesia)
- Contoh: `081234567890` → `6281234567890`

## 🔐 Multi-Tenant

Setiap query HARUS include `tenant_id` untuk isolasi data:

```typescript
// ✅ BENAR
await prisma.siswa.findMany({
  where: { tenant_id: currentTenantId }
});

// ❌ SALAH (tidak aman)
await prisma.siswa.findMany();
```

## 📊 Indexes

Semua foreign key dan kolom yang sering di-query sudah ter-index untuk performa optimal.


