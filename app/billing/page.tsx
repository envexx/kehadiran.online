"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { TopBar } from "@/components/top-bar";
import { useSubscription, useInvoices } from "@/hooks/use-swr-hooks";
import { 
  CheckCircle,
  Crown,
  Rocket,
  Lightning,
  CreditCard,
  Receipt,
  ArrowRight,
  Check
} from "phosphor-react";

export default function BillingPage() {
  const currentPlan = "pro";

  const plans = [
    {
      key: "starter",
      name: "Starter",
      price: "Rp 9.999",
      period: "/siswa/bulan",
      desc: "50–100 siswa",
      icon: Lightning,
      color: "blue",
      features: ["50–100 siswa", "Basic features", "QR Code scan", "Email support", "WhatsApp support"],
    },
    {
      key: "pro",
      name: "Professional",
      price: "Rp 12.500",
      period: "/siswa/bulan",
      desc: "101–500 siswa",
      icon: Rocket,
      color: "blue",
      popular: true,
      features: ["101–500 siswa", "All features", "QR + Manual input", "Notifikasi WA real-time", "Laporan lengkap", "Export PDF & Excel", "Priority WhatsApp support"],
    },
    {
      key: "enterprise",
      name: "Enterprise",
      price: "Rp 15.000",
      period: "/siswa/bulan",
      desc: "500+ siswa",
      icon: Crown,
      color: "amber",
      features: ["500+ siswa", "Semua fitur Pro", "Custom domain (+Rp 3jt setup)", "Dedicated account manager", "24/7 Priority support", "API access"],
    },
  ];

  const invoices = [
    { id: "INV-2025-001", date: "1 Jun 2025", amount: "Rp 599.000", status: "Lunas", method: "Transfer Bank" },
    { id: "INV-2025-002", date: "1 Mei 2025", amount: "Rp 599.000", status: "Lunas", method: "Transfer Bank" },
    { id: "INV-2025-003", date: "1 Apr 2025", amount: "Rp 599.000", status: "Lunas", method: "QRIS" },
    { id: "INV-2025-004", date: "1 Mar 2025", amount: "Rp 599.000", status: "Lunas", method: "Transfer Bank" },
  ];

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
              </div>
              <h2 className="text-2xl font-bold">Pro Plan</h2>
              <p className="text-blue-100 mt-1">Berlaku hingga 1 Juli 2025 &middot; Perpanjangan otomatis</p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-3xl font-bold">Rp 599.000</p>
                  <p className="text-blue-200 text-sm">/bulan</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
                Kelola Pembayaran
              </Button>
              <Button size="sm" className="bg-white text-blue-600 font-semibold hover:bg-blue-50">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Pilih Paket</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
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
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
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
                  <Button
                    size="sm"
                    className={`w-full font-medium ${
                      isCurrent 
                        ? "bg-gray-100 text-gray-500 cursor-default" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Paket Saat Ini" : "Pilih Paket"}
                  </Button>
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
                  <Chip size="sm" variant="flat" color="success" className="text-[10px]">{inv.status}</Chip>
                  <Button size="sm" variant="light" className="text-blue-600 text-xs">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
