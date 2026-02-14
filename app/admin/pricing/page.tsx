"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Tag, Plus, PencilSimple, Trash, Check, Star } from "phosphor-react";

interface PlanData {
  id: string;
  key: string;
  name: string;
  description: string | null;
  price_per_siswa: number;
  original_price: number | null;
  min_siswa: number;
  max_siswa: number;
  max_guru: number;
  max_kelas: number;
  sms_quota: number;
  api_calls: number;
  storage_gb: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

const emptyPlan: Omit<PlanData, "id"> = {
  key: "",
  name: "",
  description: "",
  price_per_siswa: 0,
  original_price: null,
  min_siswa: 1,
  max_siswa: 100,
  max_guru: 20,
  max_kelas: 10,
  sms_quota: 1000,
  api_calls: 10000,
  storage_gb: 1,
  features: [],
  is_popular: false,
  is_active: true,
  sort_order: 0,
};

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editPlan, setEditPlan] = useState<PlanData | null>(null);
  const [form, setForm] = useState<Omit<PlanData, "id">>(emptyPlan);
  const [featuresText, setFeaturesText] = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing-plans");
      const json = await res.json();
      if (json.data) setPlans(json.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditPlan(null);
    setForm(emptyPlan);
    setFeaturesText("");
    setError("");
    onOpen();
  };

  const openEdit = (plan: PlanData) => {
    setEditPlan(plan);
    setForm({
      key: plan.key,
      name: plan.name,
      description: plan.description || "",
      price_per_siswa: plan.price_per_siswa,
      original_price: plan.original_price,
      min_siswa: plan.min_siswa,
      max_siswa: plan.max_siswa,
      max_guru: plan.max_guru,
      max_kelas: plan.max_kelas,
      sms_quota: plan.sms_quota,
      api_calls: plan.api_calls,
      storage_gb: plan.storage_gb,
      features: plan.features || [],
      is_popular: plan.is_popular,
      is_active: plan.is_active,
      sort_order: plan.sort_order,
    });
    setFeaturesText((plan.features || []).join("\n"));
    setError("");
    onOpen();
  };

  const handleSave = async (onClose: () => void) => {
    setSaving(true);
    setError("");
    const payload = { ...form, features: featuresText.split("\n").map(s => s.trim()).filter(Boolean) };
    try {
      const url = editPlan ? `/api/admin/pricing-plans/${editPlan.id}` : "/api/admin/pricing-plans";
      const method = editPlan ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Gagal menyimpan"); setSaving(false); return; }
      await fetchPlans();
      onClose();
    } catch { setError("Terjadi kesalahan"); }
    setSaving(false);
  };

  const handleDelete = async (plan: PlanData) => {
    if (!confirm(`Hapus paket "${plan.name}"?`)) return;
    try {
      await fetch(`/api/admin/pricing-plans/${plan.id}`, { method: "DELETE" });
      await fetchPlans();
    } catch {}
  };

  const fmtCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Daftar Harga</h1>
            <p className="text-xs text-gray-500">Kelola paket harga untuk tenant. Bisa set promo (harga coret).</p>
          </div>
          <Button size="sm" color="primary" className="bg-blue-600 font-medium" startContent={<Plus size={14} weight="bold" />} onPress={openCreate}>
            Tambah Paket
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-64 animate-pulse" />)}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada paket harga</p>
            <Button size="sm" color="primary" className="bg-blue-600 mt-4" onPress={openCreate}>Tambah Paket Pertama</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-6 relative ${plan.is_active ? "border-gray-200 dark:border-gray-800" : "border-red-200 dark:border-red-900 opacity-60"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Tag size={18} className="text-blue-500" weight="fill" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{plan.name}</h3>
                      <p className="text-[10px] text-gray-500">{plan.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {plan.is_popular && <Chip size="sm" color="primary" variant="flat" className="text-[10px]">Populer</Chip>}
                    {!plan.is_active && <Chip size="sm" color="danger" variant="flat" className="text-[10px]">Nonaktif</Chip>}
                  </div>
                </div>

                <div className="mb-4">
                  {plan.original_price && plan.original_price > plan.price_per_siswa && (
                    <span className="text-sm text-gray-400 line-through mr-2">{fmtCurrency(plan.original_price)}</span>
                  )}
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{fmtCurrency(plan.price_per_siswa)}</span>
                  <span className="text-xs text-gray-500">/siswa/bulan</span>
                </div>

                <p className="text-xs text-gray-500 mb-3">{plan.description || "—"}</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-[11px]">
                  <span className="text-gray-400">Siswa</span><span className="text-gray-600 dark:text-gray-300 font-medium">{plan.min_siswa}–{plan.max_siswa}</span>
                  <span className="text-gray-400">Guru</span><span className="text-gray-600 dark:text-gray-300 font-medium">{plan.max_guru}</span>
                  <span className="text-gray-400">Kelas</span><span className="text-gray-600 dark:text-gray-300 font-medium">{plan.max_kelas}</span>
                  <span className="text-gray-400">WA Quota</span><span className="text-gray-600 dark:text-gray-300 font-medium">{plan.sms_quota.toLocaleString()}</span>
                  <span className="text-gray-400">Storage</span><span className="text-gray-600 dark:text-gray-300 font-medium">{plan.storage_gb} GB</span>
                  <span className="text-gray-400">Urutan</span><span className="text-gray-600 dark:text-gray-300 font-medium">{plan.sort_order}</span>
                </div>

                {(plan.features as string[] || []).length > 0 && (
                  <div className="space-y-1 mb-4">
                    {(plan.features as string[]).slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check size={10} weight="bold" className="text-emerald-500" />
                        <span className="text-[11px] text-gray-500">{f}</span>
                      </div>
                    ))}
                    {(plan.features as string[]).length > 3 && (
                      <span className="text-[10px] text-gray-400">+{(plan.features as string[]).length - 3} lainnya</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Button size="sm" variant="bordered" className="flex-1 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300" startContent={<PencilSimple size={12} />} onPress={() => openEdit(plan)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="bordered" className="border-red-200 text-red-500 hover:bg-red-50" isIconOnly onPress={() => handleDelete(plan)}>
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editPlan ? "Edit Paket" : "Tambah Paket Baru"}</h3>
                  <p className="text-sm text-gray-500 font-normal">Isi detail paket harga</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Key (unik)" placeholder="starter" value={form.key} onValueChange={(v) => setForm({...form, key: v})} size="sm" isDisabled={!!editPlan} classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                    <Input label="Nama Paket" placeholder="Starter" value={form.name} onValueChange={(v) => setForm({...form, name: v})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                  </div>
                  <Input label="Deskripsi" placeholder="Paket untuk sekolah kecil..." value={form.description || ""} onValueChange={(v) => setForm({...form, description: v})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Harga per Siswa (Rp)" type="number" value={String(form.price_per_siswa)} onValueChange={(v) => setForm({...form, price_per_siswa: Number(v)})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                    <Input label="Harga Coret / Promo (Rp)" type="number" placeholder="Kosongkan jika tidak ada" value={form.original_price ? String(form.original_price) : ""} onValueChange={(v) => setForm({...form, original_price: v ? Number(v) : null})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                  </div>

                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Kuota & Batas</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="Min Siswa" type="number" value={String(form.min_siswa)} onValueChange={(v) => setForm({...form, min_siswa: Number(v)})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                    <Input label="Max Siswa" type="number" value={String(form.max_siswa)} onValueChange={(v) => setForm({...form, max_siswa: Number(v)})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                    <Input label="Max Guru" type="number" value={String(form.max_guru)} onValueChange={(v) => setForm({...form, max_guru: Number(v)})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                    <Input label="Max Kelas" type="number" value={String(form.max_kelas)} onValueChange={(v) => setForm({...form, max_kelas: Number(v)})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                    <Input label="WA Quota" type="number" value={String(form.sms_quota)} onValueChange={(v) => setForm({...form, sms_quota: Number(v)})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                    <Input label="Storage (GB)" type="number" value={String(form.storage_gb)} onValueChange={(v) => setForm({...form, storage_gb: Number(v)})} size="sm" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />
                  </div>

                  <Input label="Urutan Tampil" type="number" value={String(form.sort_order)} onValueChange={(v) => setForm({...form, sort_order: Number(v)})} size="sm" className="max-w-[150px]" classNames={{ inputWrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none" }} />

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Fitur (satu per baris)</label>
                    <textarea
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
                      rows={5}
                      placeholder={"1–100 siswa\nMaks 20 guru\nQR Code scan\nEmail support"}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch size="sm" isSelected={form.is_popular} onValueChange={(v) => setForm({...form, is_popular: v})} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Paling Populer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch size="sm" isSelected={form.is_active} onValueChange={(v) => setForm({...form, is_active: v})} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Aktif</span>
                    </div>
                  </div>

                  {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2">{error}</div>}
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-200 dark:border-gray-800">
                <Button variant="bordered" className="border-gray-200 dark:border-gray-700" onPress={onClose}>Batal</Button>
                <Button color="primary" className="bg-blue-600 font-medium" isLoading={saving} onPress={() => handleSave(onClose)}>
                  {editPlan ? "Simpan Perubahan" : "Tambah Paket"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
