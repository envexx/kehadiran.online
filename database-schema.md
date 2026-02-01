# Database Schema - Sistem Presensi Kehadiran

## 📋 Daftar Tabel

1. [users](#1-users) - Tabel pengguna (admin, guru)
2. [kelas](#2-kelas) - Tabel kelas
3. [siswa](#3-siswa) - Tabel data siswa
4. [orang_tua](#4-orang_tua) - Tabel data orang tua
5. [guru](#5-guru) - Tabel data guru
6. [mata_pelajaran](#6-mata_pelajaran) - Tabel mata pelajaran
7. [jadwal_pelajaran](#7-jadwal_pelajaran) - Tabel jadwal pelajaran
8. [presensi](#8-presensi) - Tabel presensi siswa
9. [notifikasi](#9-notifikasi) - Tabel log notifikasi WhatsApp
10. [settings](#10-settings) - Tabel pengaturan sistem

---

## 1. users

Tabel untuk menyimpan data pengguna sistem (admin, guru yang bisa login).

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'guru', -- 'admin' atau 'guru'
    nama_lengkap VARCHAR(100) NOT NULL,
    nomor_telepon VARCHAR(20),
    foto VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Contoh Data:**
```sql
INSERT INTO users (username, email, password_hash, role, nama_lengkap) VALUES
('admin', 'admin@sekolah.com', '$2b$10$...', 'admin', 'Administrator Sekolah'),
('guru001', 'guru001@sekolah.com', '$2b$10$...', 'guru', 'Budi Santoso');
```

---

## 2. kelas

Tabel untuk menyimpan data kelas.

```sql
CREATE TABLE kelas (
    id SERIAL PRIMARY KEY,
    nama_kelas VARCHAR(20) UNIQUE NOT NULL, -- Contoh: 'XII RPL 1', 'XI RPL 2'
    tingkat VARCHAR(10) NOT NULL, -- 'X', 'XI', 'XII'
    jurusan VARCHAR(50), -- 'RPL', 'TKJ', 'MM', dll
    wali_kelas_id INTEGER REFERENCES users(id),
    tahun_ajaran VARCHAR(20) NOT NULL, -- '2024/2025'
    semester VARCHAR(10) NOT NULL, -- 'ganjil' atau 'genap'
    kapasitas INTEGER DEFAULT 40,
    jumlah_siswa INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kelas_nama ON kelas(nama_kelas);
CREATE INDEX idx_kelas_tahun_ajaran ON kelas(tahun_ajaran);
```

**Contoh Data:**
```sql
INSERT INTO kelas (nama_kelas, tingkat, jurusan, tahun_ajaran, semester) VALUES
('XII RPL 1', 'XII', 'RPL', '2024/2025', 'genap'),
('XII RPL 2', 'XII', 'RPL', '2024/2025', 'genap'),
('XI RPL 1', 'XI', 'RPL', '2024/2025', 'genap');
```

---

## 3. siswa

Tabel untuk menyimpan data siswa.

```sql
CREATE TABLE siswa (
    id SERIAL PRIMARY KEY,
    nisn VARCHAR(20) UNIQUE NOT NULL, -- Nomor Induk Siswa Nasional
    nis VARCHAR(20) UNIQUE, -- Nomor Induk Sekolah (opsional)
    nama_lengkap VARCHAR(100) NOT NULL,
    nama_panggilan VARCHAR(50),
    jenis_kelamin VARCHAR(1) NOT NULL, -- 'L' atau 'P'
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    alamat TEXT,
    email VARCHAR(100),
    nomor_telepon VARCHAR(20),
    foto VARCHAR(255),
    kelas_id INTEGER REFERENCES kelas(id),
    tahun_masuk INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'aktif', -- 'aktif', 'lulus', 'pindah', 'keluar'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_siswa_nisn ON siswa(nisn);
CREATE INDEX idx_siswa_nis ON siswa(nis);
CREATE INDEX idx_siswa_kelas_id ON siswa(kelas_id);
CREATE INDEX idx_siswa_status ON siswa(status);
```

**Contoh Data:**
```sql
INSERT INTO siswa (nisn, nis, nama_lengkap, jenis_kelamin, kelas_id, tahun_masuk) VALUES
('0012345678', '2024001', 'Ahmad Rizki Maulana', 'L', 1, 2024),
('0012345679', '2024002', 'Siti Nurhaliza', 'P', 1, 2024),
('0012345680', '2024003', 'Budi Santoso', 'L', 2, 2024);
```

---

## 4. orang_tua

Tabel untuk menyimpan data orang tua siswa (minimal: nama dan nomor WA untuk notifikasi).

```sql
CREATE TABLE orang_tua (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
    nama_ayah VARCHAR(100),
    nomor_wa_ayah VARCHAR(20), -- Format: 6281234567890 (tanpa +)
    pekerjaan_ayah VARCHAR(100),
    nama_ibu VARCHAR(100),
    nomor_wa_ibu VARCHAR(20), -- Format: 6281234567890 (tanpa +)
    pekerjaan_ibu VARCHAR(100),
    alamat TEXT,
    -- Preferensi notifikasi (jika ada lebih dari 1 nomor WA)
    preferensi_notifikasi VARCHAR(10) DEFAULT 'ayah', -- 'ayah', 'ibu', 'keduanya'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(siswa_id)
);

CREATE INDEX idx_orang_tua_siswa_id ON orang_tua(siswa_id);
CREATE INDEX idx_orang_tua_wa_ayah ON orang_tua(nomor_wa_ayah);
CREATE INDEX idx_orang_tua_wa_ibu ON orang_tua(nomor_wa_ibu);
```

**Contoh Data:**
```sql
INSERT INTO orang_tua (siswa_id, nama_ayah, nomor_wa_ayah, nama_ibu, nomor_wa_ibu, preferensi_notifikasi) VALUES
(1, 'Rizki Maulana', '6281234567890', 'Siti Aminah', '6281234567891', 'keduanya'),
(2, 'Ahmad Nurhaliza', '6281234567892', 'Dewi Lestari', '6281234567893', 'ibu'),
(3, 'Santoso Wijaya', '6281234567894', 'Ratna Sari', '6281234567895', 'ayah');
```

**Catatan Penting:**
- Nomor WA disimpan tanpa tanda `+` dan spasi
- Format: `6281234567890` (kode negara 62 + nomor tanpa 0 di depan)
- Minimal harus ada 1 nomor WA (ayah atau ibu)
- `preferensi_notifikasi` menentukan ke nomor mana notifikasi dikirim

---

## 5. guru

Tabel untuk menyimpan data guru (terhubung dengan users).

```sql
CREATE TABLE guru (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    nip VARCHAR(20) UNIQUE, -- Nomor Induk Pegawai
    nama_lengkap VARCHAR(100) NOT NULL,
    jenis_kelamin VARCHAR(1), -- 'L' atau 'P'
    mata_pelajaran_id INTEGER REFERENCES mata_pelajaran(id),
    nomor_telepon VARCHAR(20),
    nomor_wa VARCHAR(20), -- Untuk komunikasi
    email VARCHAR(100),
    foto VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guru_user_id ON guru(user_id);
CREATE INDEX idx_guru_nip ON guru(nip);
```

**Contoh Data:**
```sql
INSERT INTO guru (user_id, nip, nama_lengkap, mata_pelajaran_id, nomor_wa) VALUES
(2, '196001011990031001', 'Budi Santoso', 1, '6281234567800'),
(3, '196002021990032002', 'Ani Lestari', 2, '6281234567801');
```

---

## 6. mata_pelajaran

Tabel untuk menyimpan data mata pelajaran.

```sql
CREATE TABLE mata_pelajaran (
    id SERIAL PRIMARY KEY,
    kode_mapel VARCHAR(10) UNIQUE NOT NULL, -- Contoh: 'MTK', 'BIN', 'PWEB'
    nama_mapel VARCHAR(100) NOT NULL,
    singkatan VARCHAR(20), -- Contoh: 'Matematika' -> 'MTK'
    kategori VARCHAR(50), -- 'Umum', 'Jurusan', 'Pilihan'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mata_pelajaran_kode ON mata_pelajaran(kode_mapel);
```

**Contoh Data:**
```sql
INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, singkatan, kategori) VALUES
('MTK', 'Matematika', 'MTK', 'Umum'),
('BIN', 'Bahasa Indonesia', 'BIN', 'Umum'),
('PWEB', 'Pemrograman Web', 'PWEB', 'Jurusan'),
('BD', 'Basis Data', 'BD', 'Jurusan'),
('PMOB', 'Pemrograman Mobile', 'PMOB', 'Jurusan');
```

---

## 7. jadwal_pelajaran

Tabel untuk menyimpan jadwal pelajaran per kelas.

```sql
CREATE TABLE jadwal_pelajaran (
    id SERIAL PRIMARY KEY,
    kelas_id INTEGER NOT NULL REFERENCES kelas(id),
    mata_pelajaran_id INTEGER NOT NULL REFERENCES mata_pelajaran(id),
    guru_id INTEGER NOT NULL REFERENCES guru(id),
    hari VARCHAR(10) NOT NULL, -- 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'
    jam_mulai TIME NOT NULL, -- Format: '07:30:00'
    jam_selesai TIME NOT NULL, -- Format: '09:00:00'
    ruangan VARCHAR(50), -- 'R.301', 'Lab 1', 'Lapangan'
    tahun_ajaran VARCHAR(20) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(kelas_id, mata_pelajaran_id, hari, jam_mulai, tahun_ajaran, semester)
);

CREATE INDEX idx_jadwal_kelas_id ON jadwal_pelajaran(kelas_id);
CREATE INDEX idx_jadwal_hari ON jadwal_pelajaran(hari);
CREATE INDEX idx_jadwal_tahun_ajaran ON jadwal_pelajaran(tahun_ajaran);
```

**Contoh Data:**
```sql
INSERT INTO jadwal_pelajaran (kelas_id, mata_pelajaran_id, guru_id, hari, jam_mulai, jam_selesai, ruangan, tahun_ajaran, semester) VALUES
(1, 1, 1, 'senin', '07:30:00', '09:00:00', 'R.301', '2024/2025', 'genap'),
(1, 2, 2, 'senin', '09:15:00', '10:45:00', 'R.301', '2024/2025', 'genap'),
(1, 3, 3, 'senin', '11:00:00', '12:30:00', 'Lab 1', '2024/2025', 'genap');
```

---

## 8. presensi

Tabel utama untuk menyimpan data presensi siswa.

```sql
CREATE TABLE presensi (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER NOT NULL REFERENCES siswa(id),
    jadwal_pelajaran_id INTEGER NOT NULL REFERENCES jadwal_pelajaran(id),
    tanggal DATE NOT NULL,
    waktu_masuk TIMESTAMP, -- Waktu siswa melakukan presensi
    status VARCHAR(20) NOT NULL, -- 'hadir', 'izin', 'sakit', 'alpha'
    metode_input VARCHAR(20) DEFAULT 'manual', -- 'qr_code', 'fingerprint', 'manual'
    keterangan TEXT, -- Alasan izin/sakit jika ada
    foto_bukti VARCHAR(255), -- Jika ada foto bukti
    input_by INTEGER REFERENCES users(id), -- User yang input (jika manual)
    latitude DECIMAL(10, 8), -- Koordinat GPS (opsional)
    longitude DECIMAL(11, 8), -- Koordinat GPS (opsional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(siswa_id, jadwal_pelajaran_id, tanggal)
);

CREATE INDEX idx_presensi_siswa_id ON presensi(siswa_id);
CREATE INDEX idx_presensi_jadwal_id ON presensi(jadwal_pelajaran_id);
CREATE INDEX idx_presensi_tanggal ON presensi(tanggal);
CREATE INDEX idx_presensi_status ON presensi(status);
CREATE INDEX idx_presensi_siswa_tanggal ON presensi(siswa_id, tanggal);
```

**Contoh Data:**
```sql
INSERT INTO presensi (siswa_id, jadwal_pelajaran_id, tanggal, waktu_masuk, status, metode_input) VALUES
(1, 1, '2025-01-15', '2025-01-15 08:15:24', 'hadir', 'qr_code'),
(2, 1, '2025-01-15', '2025-01-15 08:14:12', 'hadir', 'qr_code'),
(3, 1, '2025-01-15', NULL, 'izin', 'manual');
```

---

## 9. notifikasi

Tabel untuk menyimpan log notifikasi WhatsApp yang dikirim ke orang tua.

```sql
CREATE TABLE notifikasi (
    id SERIAL PRIMARY KEY,
    siswa_id INTEGER NOT NULL REFERENCES siswa(id),
    orang_tua_id INTEGER NOT NULL REFERENCES orang_tua(id),
    presensi_id INTEGER REFERENCES presensi(id),
    nomor_tujuan VARCHAR(20) NOT NULL, -- Nomor WA yang dikirimi
    jenis_notifikasi VARCHAR(50) NOT NULL, -- 'presensi_hadir', 'presensi_alpha', 'presensi_izin', 'laporan_harian', 'laporan_mingguan'
    pesan TEXT NOT NULL, -- Isi pesan yang dikirim
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'delivered'
    response_data JSONB, -- Response dari API WhatsApp (opsional)
    error_message TEXT, -- Pesan error jika gagal
    sent_at TIMESTAMP, -- Waktu pengiriman
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifikasi_siswa_id ON notifikasi(siswa_id);
CREATE INDEX idx_notifikasi_status ON notifikasi(status);
CREATE INDEX idx_notifikasi_created_at ON notifikasi(created_at);
```

**Contoh Data:**
```sql
INSERT INTO notifikasi (siswa_id, orang_tua_id, presensi_id, nomor_tujuan, jenis_notifikasi, pesan, status, sent_at) VALUES
(1, 1, 1, '6281234567890', 'presensi_hadir', 'Anak Anda Ahmad Rizki Maulana telah hadir pada pelajaran Matematika hari ini pukul 08:15', 'sent', '2025-01-15 08:16:00'),
(3, 3, 3, '6281234567894', 'presensi_alpha', 'Anak Anda Budi Santoso tidak hadir (Alpha) pada pelajaran Matematika hari ini', 'sent', '2025-01-15 08:30:00');
```

---

## 10. settings

Tabel untuk menyimpan pengaturan sistem.

```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category VARCHAR(50), -- 'general', 'notifikasi', 'presensi', 'whatsapp'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);
```

**Contoh Data:**
```sql
INSERT INTO settings (key, value, description, category) VALUES
('nama_sekolah', 'SMP ISLAM TERPADU', 'Nama sekolah yang ditampilkan di kartu presensi', 'general'),
('whatsapp_api_key', 'your_api_key_here', 'API Key untuk WhatsApp Gateway', 'whatsapp'),
('whatsapp_api_url', 'https://api.whatsapp.com/v1/send', 'URL API WhatsApp Gateway', 'whatsapp'),
('jam_mulai_presensi', '07:00', 'Jam mulai presensi (format: HH:MM)', 'presensi'),
('jam_akhir_presensi', '15:00', 'Jam akhir presensi (format: HH:MM)', 'presensi'),
('notifikasi_alpha', 'true', 'Kirim notifikasi jika siswa alpha', 'notifikasi'),
('notifikasi_hadir', 'false', 'Kirim notifikasi jika siswa hadir', 'notifikasi'),
('notifikasi_laporan_harian', 'true', 'Kirim laporan harian ke orang tua', 'notifikasi'),
('notifikasi_laporan_mingguan', 'true', 'Kirim laporan mingguan ke orang tua', 'notifikasi');
```

---

## 📊 Relasi Antar Tabel

```
users (1) ──< (1) guru
guru (1) ──< (*) jadwal_pelajaran
mata_pelajaran (1) ──< (*) jadwal_pelajaran
kelas (1) ──< (*) jadwal_pelajaran
kelas (1) ──< (*) siswa
siswa (1) ──< (1) orang_tua
siswa (1) ──< (*) presensi
jadwal_pelajaran (1) ──< (*) presensi
presensi (1) ──< (*) notifikasi
orang_tua (1) ──< (*) notifikasi
users (1) ──< (*) presensi (input_by)
users (1) ──< (*) settings (updated_by)
```

---

## 🔔 Flow Notifikasi WhatsApp

### 1. Presensi Hadir (jika diaktifkan)
```
Siswa scan QR → Presensi tersimpan → Cek settings (notifikasi_hadir) 
→ Jika true → Ambil nomor WA dari orang_tua → Kirim via WhatsApp API 
→ Simpan log ke tabel notifikasi
```

### 2. Presensi Alpha
```
Siswa tidak presensi setelah jam akhir → Sistem deteksi alpha 
→ Cek settings (notifikasi_alpha) → Jika true → Kirim notifikasi 
→ Simpan log ke tabel notifikasi
```

### 3. Laporan Harian
```
Cron job setiap hari jam 15:00 → Generate laporan harian per siswa 
→ Cek settings (notifikasi_laporan_harian) → Jika true → Kirim ke orang tua 
→ Simpan log ke tabel notifikasi
```

### 4. Laporan Mingguan
```
Cron job setiap Senin jam 08:00 → Generate laporan mingguan 
→ Cek settings (notifikasi_laporan_mingguan) → Jika true → Kirim ke orang tua 
→ Simpan log ke tabel notifikasi
```

---

## 📝 Format Pesan WhatsApp

### Presensi Hadir
```
*Kehadiran - Notifikasi Presensi*

Anak Anda *[Nama Siswa]* telah hadir pada pelajaran *[Mata Pelajaran]* hari ini pukul *[Waktu]*.

Terima kasih.
```

### Presensi Alpha
```
*Kehadiran - Peringatan Alpha*

Anak Anda *[Nama Siswa]* tidak hadir (Alpha) pada pelajaran *[Mata Pelajaran]* hari ini.

Silakan hubungi wali kelas untuk informasi lebih lanjut.
```

### Presensi Izin
```
*Kehadiran - Notifikasi Izin*

Anak Anda *[Nama Siswa]* mengajukan izin pada pelajaran *[Mata Pelajaran]* hari ini.

Alasan: *[Keterangan]*
```

### Laporan Harian
```
*Kehadiran - Laporan Harian*

Laporan kehadiran *[Nama Siswa]* tanggal *[Tanggal]*:

✅ Hadir: *[Jumlah]*
⏰ Izin: *[Jumlah]*
❌ Alpha: *[Jumlah]*

Total kehadiran: *[Persentase]*%
```

### Laporan Mingguan
```
*Kehadiran - Laporan Mingguan*

Laporan kehadiran *[Nama Siswa]* minggu ini:

✅ Hadir: *[Jumlah]*
⏰ Izin: *[Jumlah]*
❌ Alpha: *[Jumlah]*

Rata-rata kehadiran: *[Persentase]*%
```

---

## 🚀 Rekomendasi Implementasi

### 1. Database
- **PostgreSQL** atau **MySQL** untuk production
- **SQLite** untuk development/testing

### 2. WhatsApp Gateway
- **Twilio WhatsApp API**
- **WhatsApp Business API**
- **Wablas** (Indonesia)
- **Fonnte** (Indonesia)

### 3. Indexing
- Pastikan semua foreign key ter-index
- Index pada kolom yang sering di-query (tanggal, status, dll)

### 4. Backup
- Backup harian untuk tabel presensi
- Backup mingguan untuk semua tabel

### 5. Security
- Hash password dengan bcrypt
- Enkripsi nomor WA jika diperlukan
- Rate limiting untuk API

---

## 📌 Catatan Penting

1. **Nomor WhatsApp**: Format `6281234567890` (tanpa +, tanpa spasi, tanpa 0 di depan)
2. **Timezone**: Gunakan timezone Indonesia (Asia/Jakarta)
3. **Tanggal**: Format DATE untuk tanggal presensi
4. **Timestamp**: Gunakan TIMESTAMP untuk waktu presensi
5. **Soft Delete**: Pertimbangkan soft delete untuk data penting
6. **Audit Trail**: Log semua perubahan penting

---

**Schema ini siap untuk diimplementasikan!** 🎉



