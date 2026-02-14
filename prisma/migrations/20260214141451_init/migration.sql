-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "nama_sekolah" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "custom_domain" VARCHAR(255),
    "alamat" TEXT,
    "nomor_telepon" VARCHAR(20),
    "email" VARCHAR(100),
    "logo" VARCHAR(255),
    "qr_mode" VARCHAR(20) NOT NULL DEFAULT 'flexible',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'admin',
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "nomor_telepon" VARCHAR(20),
    "foto" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guru" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT,
    "nip" VARCHAR(20),
    "nama_guru" VARCHAR(100) NOT NULL,
    "nomor_telepon" VARCHAR(20),
    "nomor_wa" VARCHAR(20),
    "email" VARCHAR(100),
    "foto" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelas" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nama_kelas" VARCHAR(20) NOT NULL,
    "tingkat" VARCHAR(10) NOT NULL,
    "jurusan" VARCHAR(50),
    "wali_kelas_id" TEXT,
    "tahun_ajaran" VARCHAR(20) NOT NULL,
    "semester" VARCHAR(10) NOT NULL,
    "qr_code" VARCHAR(255),
    "kapasitas" INTEGER NOT NULL DEFAULT 40,
    "jumlah_siswa" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nisn" VARCHAR(20) NOT NULL,
    "nis" VARCHAR(20),
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "nama_panggilan" VARCHAR(50),
    "jenis_kelamin" VARCHAR(1) NOT NULL,
    "tempat_lahir" VARCHAR(50),
    "tanggal_lahir" TIMESTAMP(3),
    "alamat" TEXT,
    "email" VARCHAR(100),
    "nomor_telepon" VARCHAR(20),
    "foto" VARCHAR(255),
    "qr_code" VARCHAR(255),
    "kelas_id" TEXT NOT NULL,
    "tahun_masuk" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'aktif',
    "nama_ayah" VARCHAR(100),
    "nomor_wa_ayah" VARCHAR(20),
    "nama_ibu" VARCHAR(100),
    "nomor_wa_ibu" VARCHAR(20),
    "preferensi_notifikasi" VARCHAR(10) DEFAULT 'ayah',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "hari" VARCHAR(10) NOT NULL,
    "jam_masuk" VARCHAR(5) NOT NULL,
    "jam_pulang" VARCHAR(5) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presensi" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "siswa_id" TEXT NOT NULL,
    "jadwal_id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "waktu_masuk" TIMESTAMP(3),
    "waktu_pulang" TIMESTAMP(3),
    "status_masuk" VARCHAR(20) NOT NULL,
    "status_pulang" VARCHAR(20),
    "metode_input" VARCHAR(20) NOT NULL DEFAULT 'manual',
    "keterangan" TEXT,
    "foto_bukti" VARCHAR(255),
    "input_by" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "siswa_id" TEXT NOT NULL,
    "presensi_id" TEXT,
    "nomor_tujuan" VARCHAR(20) NOT NULL,
    "jenis_notifikasi" VARCHAR(50) NOT NULL,
    "pesan" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "response_data" JSONB,
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT,
    "description" TEXT,
    "category" VARCHAR(50),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "plan" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "billing_cycle" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'IDR',
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "payment_method" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "user_id" TEXT,
    "action" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" TEXT,
    "changes" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "last_used" TIMESTAMP(3),
    "last_used_ip" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_quotas" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "max_siswa" INTEGER NOT NULL DEFAULT 100,
    "max_guru" INTEGER NOT NULL DEFAULT 20,
    "max_kelas" INTEGER NOT NULL DEFAULT 10,
    "sms_quota" INTEGER NOT NULL DEFAULT 1000,
    "api_calls" INTEGER NOT NULL DEFAULT 10000,
    "storage_gb" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "features" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "invited_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "resource" VARCHAR(50) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smtp_configs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "host" VARCHAR(255) NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 587,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "from_email" VARCHAR(255) NOT NULL,
    "from_name" VARCHAR(100) NOT NULL DEFAULT 'Kehadiran',
    "encryption" VARCHAR(10) NOT NULL DEFAULT 'tls',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smtp_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "to_email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500) NOT NULL,
    "template" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_custom_domain_key" ON "tenants"("custom_domain");

-- CreateIndex
CREATE INDEX "tenants_is_active_idx" ON "tenants"("is_active");

-- CreateIndex
CREATE INDEX "users_tenant_id_role_is_active_idx" ON "users"("tenant_id", "role", "is_active");

-- CreateIndex
CREATE INDEX "users_tenant_id_is_active_idx" ON "users"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guru_user_id_key" ON "guru"("user_id");

-- CreateIndex
CREATE INDEX "guru_tenant_id_is_active_idx" ON "guru"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "guru_tenant_id_nip_key" ON "guru"("tenant_id", "nip");

-- CreateIndex
CREATE UNIQUE INDEX "kelas_qr_code_key" ON "kelas"("qr_code");

-- CreateIndex
CREATE INDEX "kelas_tenant_id_tahun_ajaran_semester_is_active_idx" ON "kelas"("tenant_id", "tahun_ajaran", "semester", "is_active");

-- CreateIndex
CREATE INDEX "kelas_tenant_id_is_active_idx" ON "kelas"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "kelas_tenant_id_nama_kelas_tahun_ajaran_semester_key" ON "kelas"("tenant_id", "nama_kelas", "tahun_ajaran", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_qr_code_key" ON "siswa"("qr_code");

-- CreateIndex
CREATE INDEX "siswa_tenant_id_kelas_id_status_idx" ON "siswa"("tenant_id", "kelas_id", "status");

-- CreateIndex
CREATE INDEX "siswa_tenant_id_status_idx" ON "siswa"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "siswa_tenant_id_nama_lengkap_idx" ON "siswa"("tenant_id", "nama_lengkap");

-- CreateIndex
CREATE INDEX "siswa_kelas_id_status_idx" ON "siswa"("kelas_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_tenant_id_nisn_key" ON "siswa"("tenant_id", "nisn");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_tenant_id_nis_key" ON "siswa"("tenant_id", "nis");

-- CreateIndex
CREATE INDEX "jadwal_tenant_id_is_active_idx" ON "jadwal"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "jadwal_tenant_id_hari_key" ON "jadwal"("tenant_id", "hari");

-- CreateIndex
CREATE INDEX "presensi_tenant_id_tanggal_status_masuk_idx" ON "presensi"("tenant_id", "tanggal", "status_masuk");

-- CreateIndex
CREATE INDEX "presensi_tenant_id_tanggal_idx" ON "presensi"("tenant_id", "tanggal");

-- CreateIndex
CREATE INDEX "presensi_tenant_id_siswa_id_tanggal_idx" ON "presensi"("tenant_id", "siswa_id", "tanggal");

-- CreateIndex
CREATE INDEX "presensi_siswa_id_tanggal_idx" ON "presensi"("siswa_id", "tanggal");

-- CreateIndex
CREATE INDEX "presensi_tenant_id_created_at_idx" ON "presensi"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "presensi_jadwal_id_tanggal_idx" ON "presensi"("jadwal_id", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "presensi_tenant_id_siswa_id_tanggal_key" ON "presensi"("tenant_id", "siswa_id", "tanggal");

-- CreateIndex
CREATE INDEX "notifikasi_tenant_id_created_at_idx" ON "notifikasi"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "notifikasi_tenant_id_siswa_id_idx" ON "notifikasi"("tenant_id", "siswa_id");

-- CreateIndex
CREATE INDEX "notifikasi_status_created_at_idx" ON "notifikasi"("status", "created_at");

-- CreateIndex
CREATE INDEX "notifikasi_presensi_id_idx" ON "notifikasi"("presensi_id");

-- CreateIndex
CREATE INDEX "settings_tenant_id_category_idx" ON "settings"("tenant_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "settings_tenant_id_key_key" ON "settings"("tenant_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_tenant_id_key" ON "subscriptions"("tenant_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_plan_idx" ON "subscriptions"("status", "plan");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_tenant_id_status_idx" ON "invoices"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "invoices_tenant_id_issued_at_idx" ON "invoices"("tenant_id", "issued_at");

-- CreateIndex
CREATE INDEX "audit_logs_tenant_id_created_at_idx" ON "audit_logs"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_tenant_id_entity_type_created_at_idx" ON "audit_logs"("tenant_id", "entity_type", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_tenant_id_is_active_idx" ON "api_keys"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "feature_quotas_tenant_id_key" ON "feature_quotas"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "invites_token_key" ON "invites"("token");

-- CreateIndex
CREATE INDEX "invites_tenant_id_expires_at_idx" ON "invites"("tenant_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "invites_tenant_id_email_key" ON "invites"("tenant_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_resource_action_idx" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "email_logs_status_created_at_idx" ON "email_logs"("status", "created_at");

-- CreateIndex
CREATE INDEX "email_logs_template_created_at_idx" ON "email_logs"("template", "created_at");

-- CreateIndex
CREATE INDEX "email_logs_tenant_id_created_at_idx" ON "email_logs"("tenant_id", "created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi" ADD CONSTRAINT "presensi_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi" ADD CONSTRAINT "presensi_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi" ADD CONSTRAINT "presensi_jadwal_id_fkey" FOREIGN KEY ("jadwal_id") REFERENCES "jadwal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presensi" ADD CONSTRAINT "presensi_input_by_fkey" FOREIGN KEY ("input_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_presensi_id_fkey" FOREIGN KEY ("presensi_id") REFERENCES "presensi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_quotas" ADD CONSTRAINT "feature_quotas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
