# Setup Database - Kehadiran

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root project:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kehadiran?schema=public"
```

**Untuk PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kehadiran?schema=public"
```

**Untuk MySQL:**
```env
DATABASE_URL="mysql://user:password@localhost:3306/kehadiran"
```

**Untuk SQLite (Development):**
```env
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Run Migration
```bash
npm run db:migrate
```

Atau untuk development cepat:
```bash
npm run db:push
```

### 5. Seed Database (Optional)
```bash
npm run db:seed
```

### 6. Open Prisma Studio (Optional)
```bash
npm run db:studio
```

## 📋 Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes (development)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (GUI)

## 🗄️ Database Schema Overview

### Models dengan Tenant ID

Semua model memiliki `tenant_id` untuk multi-tenant support:

1. **Tenant** - Data sekolah/instansi
2. **User** - Admin & Guru (login)
3. **Guru** - Data guru (disederhanakan)
4. **Kelas** - Data kelas
5. **Siswa** - Data siswa + orang tua (digabung)
6. **Jadwal** - Jam masuk & pulang (7 hari)
7. **Presensi** - Data presensi (masuk & pulang terpisah)
8. **Notifikasi** - Log WhatsApp
9. **Setting** - Pengaturan per tenant

## 🔑 Key Features

### 1. Multi-Tenant
Setiap query HARUS include `tenant_id`:
```typescript
await prisma.siswa.findMany({
  where: { tenant_id: currentTenantId }
});
```

### 2. Data Orang Tua di Tabel Siswa
Tidak perlu join, data langsung di tabel siswa:
- `nama_ayah`, `nomor_wa_ayah`
- `nama_ibu`, `nomor_wa_ibu`
- `preferensi_notifikasi`

### 3. Jadwal Sederhana
Hanya jam masuk & pulang per hari:
- 7 hari (senin-minggu)
- Format jam: '07:00', '15:00'

### 4. Presensi Masuk & Pulang Terpisah
- `waktu_masuk` & `waktu_pulang` (terpisah)
- `status_masuk` & `status_pulang` (terpisah)
- Terhubung dengan `jadwal_id` untuk tahu hari

## 📱 Format Nomor WhatsApp

- Format: `6281234567890`
- Tanpa `+`, tanpa spasi, tanpa `0` di depan
- Contoh: `081234567890` → `6281234567890`

## 🔔 Flow Presensi

1. Siswa scan QR → Cek `jadwal` berdasarkan hari
2. Bandingkan waktu dengan `jam_masuk` / `jam_pulang`
3. Simpan ke `presensi` dengan `waktu_masuk` atau `waktu_pulang`
4. Ambil nomor WA dari `siswa.nomor_wa_ayah` / `siswa.nomor_wa_ibu`
5. Kirim notifikasi → Log ke `notifikasi`

## 🛠️ Troubleshooting

### Error: Can't reach database
- Pastikan database server running
- Cek DATABASE_URL di `.env`
- Cek kredensial database

### Error: Migration failed
- Pastikan database sudah dibuat
- Cek permission user database
- Coba `npm run db:push` untuk development

### Error: Prisma Client not generated
- Run `npm run db:generate`
- Restart dev server




