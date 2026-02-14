"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { WhatsappLogo, PaperPlaneTilt, Buildings, Check, Warning } from "phosphor-react";

interface TenantWaConfig {
  id: string;
  nama_sekolah: string;
  slug: string;
  wa_provider: string;
  wa_token: string;
  wa_sender: string;
  wa_status: string;
}

export default function AdminWhatsAppPage() {
  const [globalProvider, setGlobalProvider] = useState("fonnte");
  const [globalToken, setGlobalToken] = useState("");
  const [globalSender, setGlobalSender] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [testResult, setTestResult] = useState("");
  const [testNumber, setTestNumber] = useState("");
  const [testing, setTesting] = useState(false);

  // Per-tenant WA configs
  const [tenants, setTenants] = useState<TenantWaConfig[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);

  // Load global WA config from admin settings
  useEffect(() => {
    fetch("/api/admin/settings?category=whatsapp")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const settings = d.data as { key: string; value: string }[];
          const provider = settings.find(s => s.key === "wa_provider");
          const token = settings.find(s => s.key === "wa_token");
          const sender = settings.find(s => s.key === "wa_sender");
          if (provider) setGlobalProvider(provider.value);
          if (token) setGlobalToken(token.value);
          if (sender) setGlobalSender(sender.value);
        }
      })
      .catch(() => {});

    // Load tenants with WA status
    fetch("/api/admin/tenants?limit=100")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setTenants(d.data.map((t: any) => ({
            id: t.id,
            nama_sekolah: t.nama,
            slug: t.slug,
            wa_provider: t.wa_provider || "global",
            wa_token: t.wa_token || "",
            wa_sender: t.wa_sender || "",
            wa_status: t.wa_status || "inactive",
          })));
        }
      })
      .catch(() => {})
      .finally(() => setTenantsLoading(false));
  }, []);

  const handleSaveGlobal = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const settings = [
        { key: "wa_provider", value: globalProvider, category: "whatsapp" },
        { key: "wa_token", value: globalToken, category: "whatsapp" },
        { key: "wa_sender", value: globalSender, category: "whatsapp" },
      ];
      for (const s of settings) {
        await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(s),
        });
      }
      setSaveMsg("Konfigurasi berhasil disimpan!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Gagal menyimpan");
    }
    setSaving(false);
  };

  const handleTestSend = async () => {
    if (!testNumber) { setTestResult("Masukkan nomor tujuan"); return; }
    setTesting(true);
    setTestResult("");
    try {
      const res = await fetch("/api/admin/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: testNumber, provider: globalProvider, token: globalToken, sender: globalSender }),
      });
      const json = await res.json();
      setTestResult(res.ok ? "Pesan terkirim!" : json.error || "Gagal mengirim");
    } catch {
      setTestResult("Gagal mengirim");
    }
    setTesting(false);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">WhatsApp API</h1>
          <p className="text-xs text-gray-500">Konfigurasi WhatsApp API untuk notifikasi ke orang tua siswa</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Global WA Config */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <WhatsappLogo size={20} className="text-emerald-500" weight="fill" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Konfigurasi Global</h3>
              <p className="text-xs text-gray-500">Pengaturan default WhatsApp API untuk semua tenant</p>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <Select
              label="Provider"
              selectedKeys={[globalProvider]}
              onChange={(e) => setGlobalProvider(e.target.value)}
              size="sm"
              classNames={{ trigger: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }}
            >
              <SelectItem key="fonnte">Fonnte</SelectItem>
              <SelectItem key="wabiz">WhatsApp Business API</SelectItem>
              <SelectItem key="wablast">WABlast</SelectItem>
              <SelectItem key="custom">Custom API</SelectItem>
            </Select>
            <Input
              label="API Token"
              placeholder="Masukkan API token"
              value={globalToken}
              onValueChange={setGlobalToken}
              size="sm"
              type="password"
              classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }}
            />
            <Input
              label="Nomor Pengirim"
              placeholder="6281xxxxxxxxx"
              value={globalSender}
              onValueChange={setGlobalSender}
              size="sm"
              classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }}
            />
            <div className="flex gap-2">
              <Button color="primary" size="sm" className="bg-blue-600 font-medium" isLoading={saving} onPress={handleSaveGlobal}>
                Simpan Konfigurasi
              </Button>
            </div>
            {saveMsg && (
              <div className={`text-sm rounded-xl px-4 py-2 ${saveMsg.includes("berhasil") ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}>
                {saveMsg}
              </div>
            )}
          </div>
        </div>

        {/* Test Send */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <PaperPlaneTilt size={20} className="text-blue-500" weight="fill" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Test Kirim Pesan</h3>
              <p className="text-xs text-gray-500">Kirim pesan test untuk memastikan konfigurasi berfungsi</p>
            </div>
          </div>
          <div className="flex gap-3 max-w-lg items-end">
            <Input
              label="Nomor Tujuan"
              placeholder="6281xxxxxxxxx"
              value={testNumber}
              onValueChange={setTestNumber}
              size="sm"
              classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }}
              className="flex-1"
            />
            <Button size="sm" color="primary" className="bg-emerald-600 font-medium" isLoading={testing} onPress={handleTestSend} startContent={<PaperPlaneTilt size={14} />}>
              Test Kirim
            </Button>
          </div>
          {testResult && (
            <div className={`text-sm rounded-xl px-4 py-2 ${testResult.includes("terkirim") ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Template Pesan */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Template Pesan Default</h3>
            <p className="text-xs text-gray-500 mt-0.5">Template notifikasi WhatsApp yang digunakan untuk semua tenant</p>
          </div>
          {[
            { label: "Hadir", color: "bg-emerald-500/10 text-emerald-600", template: "Assalamualaikum, {nama_ortu}. {nama_siswa} telah hadir di sekolah pada {waktu}." },
            { label: "Terlambat", color: "bg-amber-500/10 text-amber-600", template: "Assalamualaikum, {nama_ortu}. {nama_siswa} terlambat hadir di sekolah pada {waktu}." },
            { label: "Alpha", color: "bg-red-500/10 text-red-600", template: "Assalamualaikum, {nama_ortu}. {nama_siswa} tidak hadir di sekolah hari ini tanpa keterangan." },
            { label: "Izin", color: "bg-blue-500/10 text-blue-600", template: "Assalamualaikum, {nama_ortu}. {nama_siswa} izin tidak hadir di sekolah hari ini." },
          ].map((t, i) => (
            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.color}`}>{t.label}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t.template}</p>
              <p className="text-[10px] text-gray-400 mt-2">Variabel: {"{nama_ortu}"}, {"{nama_siswa}"}, {"{waktu}"}, {"{tanggal}"}, {"{kelas}"}</p>
            </div>
          ))}
        </div>

        {/* Per-tenant status */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Status WhatsApp per Sekolah</h3>
            <p className="text-xs text-gray-500 mt-0.5">Monitor status integrasi WhatsApp untuk setiap tenant</p>
          </div>
          {tenantsLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : tenants.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">Belum ada tenant terdaftar</p>
          ) : (
            <div className="space-y-2">
              {tenants.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Buildings size={16} className="text-blue-400" weight="fill" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t.nama_sekolah}</p>
                      <p className="text-[10px] text-gray-500">{t.slug}.kehadiran.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat" color={t.wa_status === "active" ? "success" : "default"} className="text-[10px]">
                      {t.wa_status === "active" ? "Aktif" : "Belum Setup"}
                    </Chip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
