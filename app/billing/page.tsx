"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { TopBar } from "@/components/top-bar";
import { useSubscription, useInvoices } from "@/hooks/use-swr-hooks";
import { 
  Crown,
  Rocket,
  Lightning,
  Receipt,
  Check,
  ArrowUp
} from "phosphor-react";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: 12000,
    priceLabel: "Rp 12.000",
    period: "/siswa/bulan",
    desc: "1–100 siswa",
    range: "1–100",
    icon: Lightning,
    color: "blue" as const,
    features: ["1–100 siswa", "Maks 20 guru", "Maks 10 kelas", "QR Code scan", "Email support", "1.000 notifikasi WA/bulan"],
  },
  {
    key: "pro",
    name: "Professional",
    price: 10000,
    priceLabel: "Rp 10.000",
    period: "/siswa/bulan",
    desc: "101–500 siswa",
    range: "101–500",
    icon: Rocket,
    color: "blue" as const,
    popular: true,
    features: ["101–500 siswa", "Maks 50 guru", "Maks 30 kelas", "QR + Manual input", "Notifikasi WA real-time", "Laporan lengkap", "Export CSV", "5.000 notifikasi WA/bulan"],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 8999,
    priceLabel: "Rp 8.999",
    period: "/siswa/bulan",
    desc: "500+ siswa",
    range: "500+",
    icon: Crown,
    color: "amber" as const,
    features: ["500+ siswa", "Maks 200 guru", "Maks 100 kelas", "Semua fitur Pro", "Custom domain (+Rp 3jt setup)", "Dedicated account manager", "20.000 notifikasi WA/bulan", "API access"],
  },
];

function getPlanByCount(count: number) {
  if (count <= 100) return PLANS[0];
  if (count <= 500) return PLANS[1];
  return PLANS[2];
}

export default function BillingPage() {
  const { data: subData, mutate: mutateSub } = useSubscription();
  const { data: invData, mutate: mutateInv } = useInvoices();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [inputSiswa, setInputSiswa] = useState("");

  const currentPlan = subData?.plan || "free_trial";

  // Derived: auto-select plan based on input siswa count
  const siswaCount = parseInt(inputSiswa) || 0;
  const selectedPlan = siswaCount > 0 ? getPlanByCount(siswaCount) : null;

  const openUpgradeModal = () => {
    setInputSiswa("");
    setBillingCycle("monthly");
    setUpgradeError("");
    setUpgradeSuccess(false);
    onOpen();
  };

  const handleUpgrade = async (onClose: () => void) => {
    if (!selectedPlan || siswaCount < 1) { setUpgradeError("Masukkan jumlah siswa"); return; }
    setUpgrading(true); setUpgradeError("");
    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jumlah_siswa: siswaCount, billing_cycle: billingCycle }),
      });
      const json = await res.json();
      if (!res.ok) { setUpgradeError(json.error || "Gagal upgrade"); setUpgrading(false); return; }
      setUpgradeSuccess(true);
      mutateSub();
      mutateInv();
      setTimeout(() => onClose(), 2000);
    } catch { setUpgradeError("Terjadi kesalahan"); }
    setUpgrading(false);
  };

  const invoices: { id: string; date: string; amount: string; status: string; statusColor: "success" | "warning" | "danger" | "default"; method: string }[] =
    invData?.data?.map((inv: { id: string; invoice_number: string; amount: number; status: string; issued_at: string; payment_method: string | null }) => ({
      id: inv.invoice_number,
      date: new Date(inv.issued_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      amount: `Rp ${inv.amount.toLocaleString("id-ID")}`,
      status: inv.status === "paid" ? "Lunas" : inv.status === "sent" ? "Menunggu" : inv.status === "failed" ? "Gagal" : inv.status,
      statusColor: (inv.status === "paid" ? "success" : inv.status === "sent" ? "warning" : inv.status === "failed" ? "danger" : "default") as "success" | "warning" | "danger" | "default",
      method: inv.payment_method || "—",
    })) || [];

  // Pricing: harga per siswa × jumlah siswa
  const monthlyTotal = selectedPlan ? selectedPlan.price * siswaCount : 0;
  const annualTotal = selectedPlan ? selectedPlan.price * siswaCount * 10 : 0; // 10 bulan (2 gratis)
  const annualDiscount = selectedPlan ? selectedPlan.price * siswaCount * 2 : 0; // 2 bulan gratis

  return (
    <div className="min-h-screen">
      <TopBar title="Billing & Langganan" subtitle="Kelola paket langganan dan pembayaran" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Chip size="sm" className="bg-white/20 text-white border-0">Paket Aktif</Chip>
                {subData?.status === "active" && <Chip size="sm" className="bg-emerald-500/30 text-emerald-100 border-0">Active</Chip>}
              </div>
              <h2 className="text-2xl font-bold">{subData ? subData.plan.charAt(0).toUpperCase() + subData.plan.slice(1).replace('_', ' ') : '—'} Plan</h2>
              <p className="text-blue-100 mt-1">
                {subData?.ended_at ? `Berlaku hingga ${new Date(subData.ended_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Memuat...'}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-3xl font-bold">{subData ? `Rp ${subData.amount.toLocaleString('id-ID')}` : '—'}</p>
                  <p className="text-blue-200 text-sm">/{subData?.billing_cycle === "annual" ? "tahun" : "bulan"}</p>
                </div>
              </div>
              {subData?.features && (
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="text-xs text-blue-200">Maks {subData.features.max_siswa} siswa</span>
                  <span className="text-xs text-blue-200">·</span>
                  <span className="text-xs text-blue-200">Maks {subData.features.max_guru} guru</span>
                  <span className="text-xs text-blue-200">·</span>
                  <span className="text-xs text-blue-200">Maks {subData.features.max_kelas} kelas</span>
                  <span className="text-xs text-blue-200">·</span>
                  <span className="text-xs text-blue-200">{subData.features.wa_quota?.toLocaleString()} WA/bulan</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Daftar Paket</h3>
            <p className="text-xs text-gray-400">Paket otomatis dipilih berdasarkan jumlah siswa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = plan.key === currentPlan;
              return (
                <div
                  key={plan.key}
                  className={`bg-white rounded-2xl border p-6 relative transition-all ${
                    isCurrent ? "border-blue-300 shadow-md shadow-blue-100" : "border-gray-100 hover:border-blue-200 hover:shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Chip size="sm" color="primary" className="bg-blue-600 text-white text-[10px] font-semibold">
                        Paling Populer
                      </Chip>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${plan.color === "amber" ? "bg-amber-50" : "bg-blue-50"} flex items-center justify-center`}>
                      <Icon size={20} weight="fill" className={plan.color === "amber" ? "text-amber-600" : "text-blue-600"} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{plan.name}</h4>
                      <p className="text-xs text-gray-400">{plan.desc}</p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <span className="text-2xl font-bold text-gray-900">{plan.priceLabel}</span>
                    <span className="text-sm text-gray-400">{plan.period}</span>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={14} weight="bold" className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                  {isCurrent ? (
                    <Button size="sm" className="w-full bg-gray-100 text-gray-500 cursor-default font-medium" disabled>
                      Paket Saat Ini
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full bg-blue-600 text-white font-medium hover:bg-blue-700" startContent={<ArrowUp size={14} weight="bold" />} onPress={openUpgradeModal}>
                      Upgrade
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">Riwayat Pembayaran</h3>
            <p className="text-xs text-gray-400 mt-0.5">Daftar invoice dan pembayaran</p>
          </div>
          {invoices.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-400">Belum ada riwayat pembayaran</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <div key={inv.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Receipt size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inv.id}</p>
                      <p className="text-xs text-gray-400">{inv.date} &middot; {inv.method}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900">{inv.amount}</span>
                    <Chip size="sm" variant="flat" color={inv.statusColor} className="text-[10px]">{inv.status}</Chip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Upgrade Paket</h3>
                  <p className="text-sm text-gray-500 font-normal">Masukkan jumlah siswa untuk melihat harga</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                {upgradeSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-emerald-600" weight="bold" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Berhasil!</h4>
                    <p className="text-sm text-gray-500">Paket Anda telah diubah ke <strong>{selectedPlan?.name}</strong></p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Siswa count input */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah Siswa</label>
                      <input
                        type="number"
                        min={1}
                        placeholder="Masukkan jumlah siswa..."
                        value={inputSiswa}
                        onChange={(e) => setInputSiswa(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg font-semibold text-gray-900 transition-colors"
                      />
                      <div className="flex items-center gap-4 mt-2">
                        {PLANS.map(p => (
                          <span key={p.key} className={`text-xs ${selectedPlan?.key === p.key ? "text-blue-600 font-semibold" : "text-gray-400"}`}>
                            {p.range} siswa = Rp {p.price.toLocaleString("id-ID")}/siswa
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Auto-selected plan */}
                    {selectedPlan && (
                      <>
                        <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                          {(() => { const Icon = selectedPlan.icon; return <div className={`w-10 h-10 rounded-xl ${selectedPlan.color === "amber" ? "bg-amber-100" : "bg-blue-100"} flex items-center justify-center`}><Icon size={20} weight="fill" className={selectedPlan.color === "amber" ? "text-amber-600" : "text-blue-600"} /></div>; })()}
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Paket {selectedPlan.name} <Chip size="sm" className="bg-blue-600 text-white text-[10px] ml-1">Otomatis</Chip></p>
                            <p className="text-xs text-gray-500">{selectedPlan.desc} · Rp {selectedPlan.price.toLocaleString("id-ID")}/siswa/bulan</p>
                          </div>
                        </div>

                        {/* Billing cycle toggle */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">Periode Pembayaran</p>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setBillingCycle("monthly")}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${billingCycle === "monthly" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                            >
                              <p className="text-sm font-semibold text-gray-900">Bulanan</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">Rp {monthlyTotal.toLocaleString("id-ID")}</p>
                              <p className="text-xs text-gray-400">/bulan · {siswaCount} siswa</p>
                            </button>
                            <button
                              onClick={() => setBillingCycle("annual")}
                              className={`p-4 rounded-xl border-2 text-left transition-all relative ${billingCycle === "annual" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                            >
                              <div className="absolute -top-2 right-3">
                                <span className="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Hemat 17%</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">Tahunan</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">Rp {annualTotal.toLocaleString("id-ID")}</p>
                              <p className="text-xs text-gray-400">/tahun · {siswaCount} siswa <span className="text-emerald-600">(hemat Rp {annualDiscount.toLocaleString("id-ID")})</span></p>
                            </button>
                          </div>
                        </div>

                        {/* Price summary */}
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Harga per siswa</span>
                            <span className="text-sm text-gray-700">Rp {selectedPlan.price.toLocaleString("id-ID")}/siswa/bulan</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Jumlah siswa</span>
                            <span className="text-sm text-gray-700">{siswaCount} siswa</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Periode</span>
                            <span className="text-sm text-gray-700">{billingCycle === "annual" ? "12 bulan (bayar 10)" : "1 bulan"}</span>
                          </div>
                          {billingCycle === "annual" && (
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-emerald-600">Diskon tahunan (2 bulan gratis)</span>
                              <span className="text-sm text-emerald-600">-Rp {annualDiscount.toLocaleString("id-ID")}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">
                              Rp {(billingCycle === "annual" ? annualTotal : monthlyTotal).toLocaleString("id-ID")}
                              <span className="text-xs text-gray-400 font-normal">/{billingCycle === "annual" ? "tahun" : "bulan"}</span>
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {upgradeError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">{upgradeError}</div>
                    )}
                  </div>
                )}
              </ModalBody>
              {!upgradeSuccess && (
                <ModalFooter className="border-t border-gray-100">
                  <Button variant="bordered" className="border-gray-200" onPress={onClose}>Batal</Button>
                  <Button
                    color="primary"
                    className="bg-blue-600 font-medium"
                    isLoading={upgrading}
                    isDisabled={siswaCount < 1}
                    onPress={() => handleUpgrade(onClose)}
                  >
                    Konfirmasi Upgrade
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
