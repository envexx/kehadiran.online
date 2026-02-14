"use client";

import { useState, useEffect } from "react";
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
  ArrowUp,
  ArrowDown,
  WarningCircle
} from "phosphor-react";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: 9999,
    priceLabel: "Rp 9.999",
    period: "/siswa/bulan",
    desc: "50–100 siswa",
    icon: Lightning,
    color: "blue" as const,
    features: ["Maks 100 siswa", "Maks 20 guru", "Maks 10 kelas", "QR Code scan", "Email support", "1.000 notifikasi WA/bulan"],
  },
  {
    key: "pro",
    name: "Professional",
    price: 12500,
    priceLabel: "Rp 12.500",
    period: "/siswa/bulan",
    desc: "101–500 siswa",
    icon: Rocket,
    color: "blue" as const,
    popular: true,
    features: ["Maks 500 siswa", "Maks 50 guru", "Maks 30 kelas", "QR + Manual input", "Notifikasi WA real-time", "Laporan lengkap", "Export CSV", "5.000 notifikasi WA/bulan"],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: 15000,
    priceLabel: "Rp 15.000",
    period: "/siswa/bulan",
    desc: "500+ siswa",
    icon: Crown,
    color: "amber" as const,
    features: ["Maks 2.000 siswa", "Maks 200 guru", "Maks 100 kelas", "Semua fitur Pro", "Custom domain (+Rp 3jt setup)", "Dedicated account manager", "20.000 notifikasi WA/bulan", "API access"],
  },
];

export default function BillingPage() {
  const { data: subData, mutate: mutateSub } = useSubscription();
  const { data: invData, mutate: mutateInv } = useInvoices();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [jumlahSiswa, setJumlahSiswa] = useState(0);

  useEffect(() => {
    fetch("/api/siswa?limit=1").then(r => r.json()).then(d => { if (d.total != null) setJumlahSiswa(d.total); }).catch(() => {});
  }, []);

  const currentPlan = subData?.plan || "free_trial";

  const openUpgradeModal = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setBillingCycle("monthly");
    setUpgradeError("");
    setUpgradeSuccess(false);
    onOpen();
  };

  const handleUpgrade = async (onClose: () => void) => {
    if (!selectedPlan) return;
    setUpgrading(true); setUpgradeError("");
    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan.key, billing_cycle: billingCycle }),
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

  const getPlanIndex = (key: string) => PLANS.findIndex(p => p.key === key);
  const currentPlanIndex = getPlanIndex(currentPlan);

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
  const monthlyTotal = selectedPlan ? selectedPlan.price * jumlahSiswa : 0;
  const annualTotal = selectedPlan ? selectedPlan.price * jumlahSiswa * 10 : 0; // 10 bulan (2 gratis)
  const annualDiscount = selectedPlan ? selectedPlan.price * jumlahSiswa * 2 : 0; // 2 bulan gratis

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
          <h3 className="font-semibold text-gray-900 mb-4">Pilih Paket</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = plan.key === currentPlan;
              const planIndex = getPlanIndex(plan.key);
              const isUpgrade = planIndex > currentPlanIndex;
              const isDowngrade = planIndex < currentPlanIndex && currentPlanIndex >= 0;
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
                  ) : isUpgrade ? (
                    <Button size="sm" className="w-full bg-blue-600 text-white font-medium hover:bg-blue-700" startContent={<ArrowUp size={14} weight="bold" />} onPress={() => openUpgradeModal(plan)}>
                      Upgrade
                    </Button>
                  ) : isDowngrade ? (
                    <Button size="sm" variant="bordered" className="w-full border-gray-200 text-gray-600 font-medium" startContent={<ArrowDown size={14} />} onPress={() => openUpgradeModal(plan)}>
                      Downgrade
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full bg-blue-600 text-white font-medium hover:bg-blue-700" onPress={() => openUpgradeModal(plan)}>
                      Pilih Paket
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

      {/* Upgrade/Downgrade Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedPlan && getPlanIndex(selectedPlan.key) > currentPlanIndex ? "Upgrade" : "Ganti"} Paket
                  </h3>
                  <p className="text-sm text-gray-500 font-normal">Konfirmasi perubahan paket langganan</p>
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
                  <>
                    {selectedPlan && (
                      <div className="space-y-5">
                        {/* Plan summary */}
                        <div className="bg-gray-50 rounded-2xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            {(() => { const Icon = selectedPlan.icon; return <div className={`w-10 h-10 rounded-xl ${selectedPlan.color === "amber" ? "bg-amber-50" : "bg-blue-50"} flex items-center justify-center`}><Icon size={20} weight="fill" className={selectedPlan.color === "amber" ? "text-amber-600" : "text-blue-600"} /></div>; })()}
                            <div>
                              <h4 className="font-bold text-gray-900">{selectedPlan.name}</h4>
                              <p className="text-xs text-gray-400">{selectedPlan.desc}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {selectedPlan.features.slice(0, 4).map((f, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <Check size={12} weight="bold" className="text-emerald-500" />
                                <span className="text-xs text-gray-600">{f}</span>
                              </div>
                            ))}
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
                              <p className="text-xs text-gray-400">/bulan · {jumlahSiswa} siswa</p>
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
                              <p className="text-xs text-gray-400">/tahun · {jumlahSiswa} siswa <span className="text-emerald-600">(hemat Rp {annualDiscount.toLocaleString("id-ID")})</span></p>
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
                            <span className="text-sm text-gray-500">Jumlah siswa aktif</span>
                            <span className="text-sm text-gray-700">{jumlahSiswa} siswa</span>
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

                        {/* Warning for downgrade */}
                        {getPlanIndex(selectedPlan.key) < currentPlanIndex && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                            <WarningCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" weight="fill" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">Perhatian</p>
                              <p className="text-xs text-amber-700 mt-1">Downgrade akan mengurangi kuota siswa, guru, dan kelas. Pastikan data Anda tidak melebihi batas paket baru.</p>
                            </div>
                          </div>
                        )}

                        {upgradeError && (
                          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">{upgradeError}</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </ModalBody>
              {!upgradeSuccess && (
                <ModalFooter className="border-t border-gray-100">
                  <Button variant="bordered" className="border-gray-200" onPress={onClose}>Batal</Button>
                  <Button
                    color="primary"
                    className="bg-blue-600 font-medium"
                    isLoading={upgrading}
                    onPress={() => handleUpgrade(onClose)}
                  >
                    {selectedPlan && getPlanIndex(selectedPlan.key) > currentPlanIndex ? "Konfirmasi Upgrade" : "Konfirmasi Perubahan"}
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
