"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { TopBar } from "@/components/top-bar";
import { useSettings } from "@/hooks/use-swr-hooks";
import { 
  User,
  Lock,
  Buildings,
  BellRinging,
  Database,
  WhatsappLogo,
  Key,
  Shield,
  Globe,
  Camera
} from "phosphor-react";

const tabs = [
  { key: "profile", label: "Profil", icon: User },
  { key: "school", label: "Sekolah", icon: Buildings },
  { key: "security", label: "Keamanan", icon: Lock },
  { key: "notifications", label: "Notifikasi", icon: BellRinging },
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappLogo },
  { key: "system", label: "Sistem", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen">
      <TopBar title="Pengaturan" subtitle="Kelola preferensi dan konfigurasi sistem" />

      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="hidden md:block w-[220px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-2 sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} weight={isActive ? "fill" : "regular"} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Tab Selector */}
            <div className="md:hidden mb-4">
              <Select
                selectedKeys={[activeTab]}
                onSelectionChange={(keys) => setActiveTab(Array.from(keys)[0] as string)}
                size="sm"
                classNames={{ trigger: "bg-white border border-gray-200 shadow-none" }}
              >
                {tabs.map((tab) => (
                  <SelectItem key={tab.key}>{tab.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Profile */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Profil Admin</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Kelola informasi akun Anda</p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Avatar src="https://i.pravatar.cc/150?u=admin" className="w-20 h-20" />
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Camera size={12} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Admin Sekolah</p>
                    <p className="text-sm text-gray-400">admin@sekolah.com</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG max 2MB</p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nama Lengkap" defaultValue="Admin Sekolah" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Username" defaultValue="admin" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Email" type="email" defaultValue="admin@sekolah.com" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Nomor Telepon" defaultValue="081234567890" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="bordered" size="sm" className="border-gray-200">Batal</Button>
                  <Button color="primary" size="sm" className="bg-blue-600 font-medium">Simpan</Button>
                </div>
              </div>
            )}

            {/* School */}
            {activeTab === "school" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Informasi Sekolah</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Kelola data sekolah Anda</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nama Sekolah" defaultValue="SMK Negeri 1 Batam" size="sm" className="col-span-2" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Alamat" defaultValue="Jl. Pendidikan No. 1, Batam" size="sm" className="col-span-2" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Email Sekolah" defaultValue="info@smkn1batam.sch.id" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Telepon" defaultValue="0778-123456" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Tahun Ajaran" defaultValue="2024/2025" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Select label="Semester" defaultSelectedKeys={["genap"]} size="sm" classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}>
                    <SelectItem key="ganjil">Ganjil</SelectItem>
                    <SelectItem key="genap">Genap</SelectItem>
                  </Select>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-3">Mode QR Code</h4>
                  <Select label="Mode Presensi QR" defaultSelectedKeys={["flexible"]} size="sm" className="max-w-sm" classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}>
                    <SelectItem key="gate_only">Gerbang Sekolah Saja</SelectItem>
                    <SelectItem key="class_only">Per Kelas Saja</SelectItem>
                    <SelectItem key="flexible">Fleksibel (Keduanya)</SelectItem>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="bordered" size="sm" className="border-gray-200">Batal</Button>
                  <Button color="primary" size="sm" className="bg-blue-600 font-medium">Simpan</Button>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <div>
                    <h3 className="font-semibold text-gray-900">Ubah Password</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Pastikan password Anda kuat dan unik</p>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <Input label="Password Lama" type="password" placeholder="Masukkan password lama" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <Input label="Password Baru" type="password" placeholder="Minimal 8 karakter" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password baru" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <Button color="primary" size="sm" className="bg-blue-600 font-medium">Update Password</Button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Tambahkan lapisan keamanan ekstra</p>
                    </div>
                    <Switch size="sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-1">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900">Preferensi Notifikasi</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Atur notifikasi yang ingin Anda terima</p>
                </div>
                {[
                  { title: "Notifikasi Presensi", desc: "Terima notifikasi saat ada presensi baru", on: true },
                  { title: "Email Harian", desc: "Terima laporan harian via email", on: true },
                  { title: "Notifikasi Siswa Alpha", desc: "Peringatan saat ada siswa yang alpha", on: true },
                  { title: "Laporan Mingguan", desc: "Terima ringkasan mingguan", on: false },
                  { title: "Notifikasi WhatsApp", desc: "Kirim notifikasi ke orang tua via WA", on: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <Switch size="sm" defaultSelected={item.on} />
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp */}
            {activeTab === "whatsapp" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <div>
                    <h3 className="font-semibold text-gray-900">Konfigurasi WhatsApp API</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Hubungkan dengan Fonnte atau WhatsApp Business API</p>
                  </div>
                  <div className="space-y-4 max-w-lg">
                    <Select label="Provider" defaultSelectedKeys={["fonnte"]} size="sm" classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}>
                      <SelectItem key="fonnte">Fonnte</SelectItem>
                      <SelectItem key="wabiz">WhatsApp Business API</SelectItem>
                    </Select>
                    <Input label="API Token" placeholder="Masukkan API token" size="sm" type="password" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <Input label="Nomor Pengirim" placeholder="6281xxxxxxxxx" size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <div className="flex gap-2">
                      <Button size="sm" variant="bordered" className="border-gray-200">Test Kirim</Button>
                      <Button color="primary" size="sm" className="bg-blue-600 font-medium">Simpan</Button>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Template Pesan</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Kustomisasi template notifikasi WhatsApp</p>
                  </div>
                  {[
                    { label: "Hadir", template: "Assalamualaikum, {nama_ortu}. {nama_siswa} telah hadir di sekolah pada {waktu}." },
                    { label: "Terlambat", template: "Assalamualaikum, {nama_ortu}. {nama_siswa} terlambat hadir di sekolah pada {waktu}." },
                    { label: "Alpha", template: "Assalamualaikum, {nama_ortu}. {nama_siswa} tidak hadir di sekolah hari ini tanpa keterangan." },
                  ].map((t, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs font-semibold text-gray-700 mb-1.5">{t.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{t.template}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Informasi Sistem</h3>
                  <div className="space-y-0">
                    {[
                      { label: "Versi Aplikasi", value: "v1.0.0" },
                      { label: "Database", value: "PostgreSQL 15" },
                      { label: "Storage", value: "2.5 GB / 10 GB" },
                      { label: "Last Backup", value: "2 jam yang lalu" },
                      { label: "Plan", value: "Pro" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-500">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Maintenance</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<Database size={14} />}>Backup Database</Button>
                    <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<Shield size={14} />}>Export Data</Button>
                    <Button size="sm" variant="bordered" className="border-red-200 text-red-500 hover:bg-red-50">Clear Cache</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




