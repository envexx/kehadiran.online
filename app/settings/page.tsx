"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { TopBar } from "@/components/top-bar";
import { useSettings, useSubscription, useCurrentUser } from "@/hooks/use-swr-hooks";
import { 
  User,
  Lock,
  Buildings,
  BellRinging,
  Database,
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
  { key: "api", label: "API Key", icon: Key },
  { key: "system", label: "Sistem", icon: Database },
];

interface SettingItem { key: string; value: string; category: string }

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: settingsData, mutate: mutateSettings } = useSettings(undefined, undefined);
  const { data: subData } = useSubscription();
  const { data: meData, mutate: mutateMe } = useCurrentUser();
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [pNama, setPNama] = useState("");
  const [pUsername, setPUsername] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pTelp, setPTelp] = useState("");

  // School form state
  const [sNama, setSNama] = useState("");
  const [sAlamat, setSAlamat] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sTelp, setSTelp] = useState("");
  const [sTahunAjaran, setSTahunAjaran] = useState("");
  const [sSemester, setSSemester] = useState("");

  // Populate form from API data
  useEffect(() => {
    if (meData?.user) {
      setPNama(meData.user.nama_lengkap || "");
      setPUsername(meData.user.username || "");
      setPEmail(meData.user.email || "");
      setPTelp(meData.user.nomor_telepon || "");
    }
    if (meData?.tenant) {
      setSNama(meData.tenant.nama_sekolah || "");
      setSAlamat(meData.tenant.alamat || "");
      setSEmail(meData.tenant.email || "");
      setSTelp(meData.tenant.nomor_telepon || "");
    }
  }, [meData]);

  // Populate tahun ajaran & semester from settings
  useEffect(() => {
    if (settingsData?.data) {
      const ta = settingsData.data.find((s: SettingItem) => s.key === "tahun_ajaran");
      const sm = settingsData.data.find((s: SettingItem) => s.key === "semester");
      if (ta) setSTahunAjaran(ta.value);
      if (sm) setSSemester(sm.value);
    }
  }, [settingsData]);

  const getVal = (key: string, fallback = "") => {
    const item = settingsData?.data?.find((s: SettingItem) => s.key === key);
    return item?.value || fallback;
  };

  const handleSaveSetting = async (key: string, value: string, category: string) => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, category }),
      });
      mutateSettings();
    } catch {}
    setSaving(false);
  };

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
                    <Avatar name={pNama} src={meData?.user?.foto || undefined} className="w-20 h-20" />
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Camera size={12} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pNama || "—"}</p>
                    <p className="text-sm text-gray-400">{pEmail || "—"}</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG max 2MB</p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nama Lengkap" value={pNama} onValueChange={setPNama} size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Username" value={pUsername} onValueChange={setPUsername} size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Email" type="email" value={pEmail} onValueChange={setPEmail} size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  <Input label="Nomor Telepon" value={pTelp} onValueChange={setPTelp} size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="bordered" size="sm" className="border-gray-200" onPress={() => { if (meData?.user) { setPNama(meData.user.nama_lengkap || ""); setPUsername(meData.user.username || ""); setPEmail(meData.user.email || ""); setPTelp(meData.user.nomor_telepon || ""); } }}>Batal</Button>
                  <Button color="primary" size="sm" className="bg-blue-600 font-medium" isLoading={saving}>Simpan</Button>
                </div>
              </div>
            )}

            {/* School */}
            {activeTab === "school" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Informasi Sekolah</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Kelola data sekolah Anda</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nama Sekolah" value={sNama} onValueChange={setSNama} size="sm" className="col-span-2" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <Input label="Alamat" value={sAlamat} onValueChange={setSAlamat} size="sm" className="col-span-2" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <Input label="Email Sekolah" value={sEmail} onValueChange={setSEmail} size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                    <Input label="Telepon" value={sTelp} onValueChange={setSTelp} size="sm" classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="bordered" size="sm" className="border-gray-200" onPress={() => { if (meData?.tenant) { setSNama(meData.tenant.nama_sekolah || ""); setSAlamat(meData.tenant.alamat || ""); setSEmail(meData.tenant.email || ""); setSTelp(meData.tenant.nomor_telepon || ""); } }}>Batal</Button>
                    <Button color="primary" size="sm" className="bg-blue-600 font-medium" isLoading={saving}>Simpan</Button>
                  </div>
                </div>

                {/* Tahun Ajaran & Semester */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Tahun Ajaran & Semester</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Atur tahun ajaran dan semester aktif. Data tahun ajaran sebelumnya tetap tersimpan dan bisa diakses kembali.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Tahun Ajaran Aktif"
                      placeholder="Pilih tahun ajaran"
                      size="sm"
                      isRequired
                      selectedKeys={sTahunAjaran ? [sTahunAjaran] : []}
                      onChange={(e) => setSTahunAjaran(e.target.value)}
                      classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}
                    >
                      <SelectItem key="2025/2026">2025/2026</SelectItem>
                      <SelectItem key="2024/2025">2024/2025</SelectItem>
                      <SelectItem key="2023/2024">2023/2024</SelectItem>
                      <SelectItem key="2022/2023">2022/2023</SelectItem>
                    </Select>
                    <Select
                      label="Semester Aktif"
                      placeholder="Pilih semester"
                      size="sm"
                      isRequired
                      selectedKeys={sSemester ? [sSemester] : []}
                      onChange={(e) => setSSemester(e.target.value)}
                      classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}
                    >
                      <SelectItem key="ganjil">Ganjil</SelectItem>
                      <SelectItem key="genap">Genap</SelectItem>
                    </Select>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-700">
                      <strong>Info:</strong> Mengubah tahun ajaran atau semester tidak akan menghapus data sebelumnya. 
                      Semua data presensi, kelas, dan laporan dari tahun ajaran sebelumnya tetap tersimpan dan bisa diakses melalui filter.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      color="primary"
                      size="sm"
                      className="bg-blue-600 font-medium"
                      isLoading={saving}
                      onPress={async () => {
                        if (!sTahunAjaran || !sSemester) return;
                        setSaving(true);
                        try {
                          await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "tahun_ajaran", value: sTahunAjaran, category: "school" }) });
                          await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "semester", value: sSemester, category: "school" }) });
                          mutateSettings();
                        } catch {}
                        setSaving(false);
                      }}
                    >
                      Simpan Tahun Ajaran
                    </Button>
                  </div>
                </div>

                {/* Mode QR Code */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Mode QR Code</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Pilih mode presensi QR Code untuk sekolah Anda</p>
                  </div>
                  <Select label="Mode Presensi QR" selectedKeys={meData?.tenant?.qr_mode ? [meData.tenant.qr_mode] : ["flexible"]} size="sm" className="max-w-sm" classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}>
                    <SelectItem key="gate_only">Gerbang Sekolah Saja</SelectItem>
                    <SelectItem key="class_only">Per Kelas Saja</SelectItem>
                    <SelectItem key="flexible">Fleksibel (Keduanya)</SelectItem>
                  </Select>
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

            {/* API Key */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <div>
                    <h3 className="font-semibold text-gray-900">API Key</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      API Key digunakan untuk integrasi dengan sistem eksternal. Hubungi superadmin untuk setup WhatsApp API dan konfigurasi lainnya.
                    </p>
                  </div>
                  <div className="space-y-4 max-w-lg">
                    <Input
                      label="API Key"
                      placeholder="API key akan ditampilkan di sini"
                      size="sm"
                      type="password"
                      value={getVal("api_key")}
                      isReadOnly
                      classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }}
                      endContent={
                        getVal("api_key") ? (
                          <button
                            className="text-xs text-blue-600 font-medium hover:text-blue-700"
                            onClick={() => { navigator.clipboard.writeText(getVal("api_key")); }}
                          >
                            Copy
                          </button>
                        ) : null
                      }
                    />
                    <Input
                      label="Webhook URL (opsional)"
                      placeholder="https://example.com/webhook"
                      size="sm"
                      value={getVal("webhook_url")}
                      classNames={{ inputWrapper: "bg-gray-50 border border-gray-200 shadow-none" }}
                      onValueChange={(v) => handleSaveSetting("webhook_url", v, "api")}
                    />
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <p className="text-xs text-amber-700">
                      <strong>Info:</strong> API Key dan konfigurasi WhatsApp API dikelola oleh superadmin. 
                      Jika Anda memerlukan API key baru atau perubahan konfigurasi, silakan hubungi tim support.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Informasi Integrasi</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Status integrasi yang tersedia untuk sekolah Anda</p>
                  </div>
                  {[
                    { label: "WhatsApp Notifikasi", desc: "Notifikasi kehadiran ke orang tua via WhatsApp", status: getVal("wa_api_status", "inactive") },
                    { label: "Email Notifikasi", desc: "Notifikasi via email untuk admin dan orang tua", status: getVal("email_status", "active") },
                    { label: "Webhook", desc: "Kirim data presensi ke sistem eksternal", status: getVal("webhook_url") ? "active" : "inactive" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <Chip size="sm" variant="flat" color={item.status === "active" ? "success" : "default"} className="text-[10px]">
                        {item.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Chip>
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
                      { label: "Storage", value: "—" },
                      { label: "Last Backup", value: "—" },
                      { label: "Plan", value: subData ? subData.plan.charAt(0).toUpperCase() + subData.plan.slice(1).replace('_', ' ') : "—" },
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




