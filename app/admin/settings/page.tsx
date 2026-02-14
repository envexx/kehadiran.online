"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Avatar } from "@heroui/avatar";
import { useTheme } from "next-themes";
import { 
  User,
  Lock,
  Globe,
  Database,
  ArrowClockwise,
  FloppyDisk,
  Sun,
  Moon,
  PaintBrush
} from "phosphor-react";

const inputCls = { inputWrapper: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700", input: "text-gray-900 dark:text-gray-200", label: "text-gray-500 dark:text-gray-400" };

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [profileSaving, setProfileSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const [nama, setNama] = useState("Super Admin");
  const [email, setEmail] = useState("super@kehadiran.online");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleProfileSave = async () => {
    setProfileSaving(true); setProfileMsg("");
    try {
      const res = await fetch("/api/admin/settings/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nama, email }) });
      const json = await res.json();
      setProfileMsg(json.success ? "Profil berhasil disimpan" : (json.error || "Gagal menyimpan"));
    } catch { setProfileMsg("Gagal menyimpan"); }
    setProfileSaving(false);
  };

  const handlePasswordSave = async () => {
    if (newPw !== confirmPw) { setPwMsg("Password baru tidak cocok"); return; }
    if (newPw.length < 8) { setPwMsg("Password minimal 8 karakter"); return; }
    setPwSaving(true); setPwMsg("");
    try {
      const res = await fetch("/api/admin/settings/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ old_password: oldPw, new_password: newPw }) });
      const json = await res.json();
      if (json.success) { setPwMsg("Password berhasil diubah"); setOldPw(""); setNewPw(""); setConfirmPw(""); } else { setPwMsg(json.error || "Gagal mengubah password"); }
    } catch { setPwMsg("Gagal mengubah password"); }
    setPwSaving(false);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
          <p className="text-xs text-gray-500">Konfigurasi global platform</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
        {/* Theme */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PaintBrush size={16} className="text-pink-400" weight="fill" />
            Tampilan
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Mode Gelap</p>
              <p className="text-[10px] text-gray-500">Ganti tampilan antara terang dan gelap</p>
            </div>
            <div className="flex items-center gap-3">
              {mounted && (
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  {theme === "dark" ? <Moon size={14} weight="fill" /> : <Sun size={14} weight="fill" />}
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
              )}
              <Switch
                size="sm"
                isSelected={mounted && theme === "dark"}
                onValueChange={(val) => setTheme(val ? "dark" : "light")}
                classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }}
              />
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={16} className="text-blue-400" weight="fill" />
            Profil Super Admin
          </h2>
          <div className="flex items-center gap-4 mb-5">
            <Avatar name="Super Admin" size="lg" className="w-16 h-16" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Super Admin</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Nama Lengkap" value={nama} onValueChange={setNama} size="sm" classNames={inputCls} />
            <Input label="Email" value={email} onValueChange={setEmail} size="sm" classNames={inputCls} />
          </div>
          {profileMsg && <p className={`text-xs mt-3 ${profileMsg.includes("berhasil") ? "text-emerald-500" : "text-red-500"}`}>{profileMsg}</p>}
          <div className="flex justify-end mt-4">
            <Button size="sm" className="bg-blue-600 text-white font-medium" isLoading={profileSaving} onPress={handleProfileSave} startContent={<FloppyDisk size={14} weight="fill" />}>Simpan Profil</Button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock size={16} className="text-amber-400" weight="fill" />
            Ubah Password
          </h2>
          <div className="space-y-3">
            <Input label="Password Lama" type="password" size="sm" value={oldPw} onValueChange={setOldPw} classNames={inputCls} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Password Baru" type="password" size="sm" value={newPw} onValueChange={setNewPw} classNames={inputCls} />
              <Input label="Konfirmasi Password" type="password" size="sm" value={confirmPw} onValueChange={setConfirmPw} classNames={inputCls} />
            </div>
          </div>
          {pwMsg && <p className={`text-xs mt-3 ${pwMsg.includes("berhasil") ? "text-emerald-500" : "text-red-500"}`}>{pwMsg}</p>}
          <div className="flex justify-end mt-4">
            <Button size="sm" className="bg-amber-600 text-white font-medium" isLoading={pwSaving} onPress={handlePasswordSave} startContent={<Lock size={14} weight="fill" />}>Ubah Password</Button>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe size={16} className="text-emerald-400" weight="fill" />
            Platform
          </h2>
          <div className="space-y-3">
            <Input label="Nama Platform" defaultValue="Kehadiran" size="sm" classNames={inputCls} />
            <Input label="Domain" defaultValue="kehadiran.online" size="sm" classNames={inputCls} />
            <Input label="Support Email" defaultValue="support@kehadiran.online" size="sm" classNames={inputCls} />
          </div>
        </div>

        {/* Database */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Database size={16} className="text-purple-400" weight="fill" />
            Database & Maintenance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Auto Backup</p>
                <p className="text-[10px] text-gray-500">Backup database otomatis setiap hari jam 02:00</p>
              </div>
              <Switch size="sm" defaultSelected classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Maintenance Mode</p>
                <p className="text-[10px] text-gray-500">Nonaktifkan akses tenant sementara</p>
              </div>
              <Switch size="sm" classNames={{ wrapper: "group-data-[selected=true]:bg-red-600" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
