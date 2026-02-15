"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { WhatsappLogo, PaperPlaneTilt, FloppyDisk, PencilSimple } from "phosphor-react";

const DEFAULT_TEMPLATES: Record<string, { label: string; color: string; defaultText: string }> = {
  wa_tpl_hadir: { label: "Hadir", color: "bg-emerald-500/10 text-emerald-600", defaultText: "Assalamualaikum, {nama_ortu}. {nama_siswa} telah hadir di sekolah pada {waktu}." },
  wa_tpl_terlambat: { label: "Terlambat", color: "bg-amber-500/10 text-amber-600", defaultText: "Assalamualaikum, {nama_ortu}. {nama_siswa} terlambat hadir di sekolah pada {waktu}." },
  wa_tpl_alpha: { label: "Alpha", color: "bg-red-500/10 text-red-600", defaultText: "Assalamualaikum, {nama_ortu}. {nama_siswa} tidak hadir di sekolah hari ini tanpa keterangan." },
  wa_tpl_pulang: { label: "Pulang", color: "bg-sky-500/10 text-sky-600", defaultText: "Assalamualaikum, {nama_ortu}. {nama_siswa} telah pulang dari sekolah pada {waktu}. Terima kasih." },
};

export default function AdminWhatsAppPage() {
  const [globalProvider, setGlobalProvider] = useState("fonnte");
  const [globalToken, setGlobalToken] = useState("");
  const [globalSender, setGlobalSender] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [testResult, setTestResult] = useState("");
  const [testNumber, setTestNumber] = useState("");
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Templates state
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [editingTpl, setEditingTpl] = useState<string | null>(null);
  const [savingTpl, setSavingTpl] = useState(false);

  // Load all WA settings from GlobalSetting
  useEffect(() => {
    setLoading(true);
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

          // Load templates
          const tpls: Record<string, string> = {};
          for (const key of Object.keys(DEFAULT_TEMPLATES)) {
            const found = settings.find(s => s.key === key);
            tpls[key] = found?.value || DEFAULT_TEMPLATES[key].defaultText;
          }
          setTemplates(tpls);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSetting = async (key: string, value: string) => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, category: "whatsapp" }),
    });
  };

  const handleSaveGlobal = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await saveSetting("wa_provider", globalProvider);
      await saveSetting("wa_token", globalToken);
      await saveSetting("wa_sender", globalSender);
      setSaveMsg("Konfigurasi berhasil disimpan!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Gagal menyimpan");
    }
    setSaving(false);
  };

  const handleSaveTemplate = async (key: string) => {
    setSavingTpl(true);
    try {
      await saveSetting(key, templates[key]);
      setEditingTpl(null);
    } catch {}
    setSavingTpl(false);
  };

  const handleTestSend = async () => {
    if (!testNumber) { setTestResult("Masukkan nomor tujuan"); return; }
    setTesting(true);
    setTestResult("");
    try {
      const res = await fetch("/api/admin/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: testNumber }),
      });
      const json = await res.json();
      setTestResult(res.ok ? "Pesan test berhasil terkirim!" : json.error || "Gagal mengirim");
    } catch {
      setTestResult("Gagal mengirim pesan");
    }
    setTesting(false);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">WhatsApp API</h1>
          <p className="text-xs text-gray-500">Konfigurasi global WhatsApp API — berlaku untuk semua tenant</p>
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
              <h3 className="font-semibold text-gray-900 dark:text-white">Konfigurasi API</h3>
              <p className="text-xs text-gray-500">Pengaturan WhatsApp API global — digunakan oleh semua sekolah</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 max-w-lg">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
            </div>
          ) : (
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
                placeholder="Masukkan API token dari provider"
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
                <Button color="primary" size="sm" className="bg-blue-600 font-medium" isLoading={saving} onPress={handleSaveGlobal} startContent={<FloppyDisk size={14} />}>
                  Simpan Konfigurasi
                </Button>
              </div>
              {saveMsg && (
                <div className={`text-sm rounded-xl px-4 py-2 ${saveMsg.includes("berhasil") ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}>
                  {saveMsg}
                </div>
              )}
            </div>
          )}
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
            <div className={`text-sm rounded-xl px-4 py-2 ${testResult.includes("berhasil") ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Editable Templates */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Template Pesan</h3>
              <p className="text-xs text-gray-500 mt-0.5">Template notifikasi WhatsApp — klik Edit untuk mengubah</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Variabel yang tersedia:</strong> {"{nama_ortu}"}, {"{nama_siswa}"}, {"{waktu}"}, {"{tanggal}"}, {"{kelas}"}, {"{sekolah}"}
            </p>
          </div>
          <div className="space-y-3">
            {Object.entries(DEFAULT_TEMPLATES).map(([key, meta]) => (
              <div key={key} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                  {editingTpl === key ? (
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="light" className="text-gray-400 h-6 min-w-0 px-2 text-[11px]" onPress={() => { setEditingTpl(null); setTemplates(prev => ({ ...prev, [key]: prev[key] })); }}>
                        Batal
                      </Button>
                      <Button size="sm" color="primary" className="bg-blue-600 h-6 min-w-0 px-3 text-[11px] font-medium" isLoading={savingTpl} onPress={() => handleSaveTemplate(key)} startContent={<FloppyDisk size={10} />}>
                        Simpan
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="light" className="text-blue-600 h-6 min-w-0 px-2 text-[11px]" onPress={() => setEditingTpl(key)} startContent={<PencilSimple size={10} />}>
                      Edit
                    </Button>
                  )}
                </div>
                {editingTpl === key ? (
                  <textarea
                    value={templates[key] || ""}
                    onChange={(e) => setTemplates(prev => ({ ...prev, [key]: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                  />
                ) : (
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{templates[key] || meta.defaultText}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
