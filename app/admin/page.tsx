"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import Link from "next/link";
import { 
  Buildings,
  Users,
  Student,
  CreditCard,
  TrendUp,
  ArrowRight,
  Envelope,
  CheckCircle,
  XCircle,
  Clock,
  ChartLineUp
} from "phosphor-react";
import { useAdminOverview } from "@/hooks/use-swr-hooks";

export default function AdminOverviewPage() {
  const { data, isLoading } = useAdminOverview();

  const statsConfig = [
    { key: "tenants", title: "Total Sekolah", icon: Buildings, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    { key: "users", title: "Total Users", icon: Users, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400" },
    { key: "siswa", title: "Total Siswa", icon: Student, iconBg: "bg-purple-500/10", iconColor: "text-purple-400" },
    { key: "mrr", title: "MRR", icon: CreditCard, iconBg: "bg-amber-500/10", iconColor: "text-amber-400", isCurrency: true },
  ];

  const formatValue = (key: string, val: number, isCurrency?: boolean) => {
    if (isCurrency) return `Rp ${(val / 1000000).toFixed(1)}jt`;
    return val?.toLocaleString("id-ID") || "0";
  };

  const planColor = (plan: string) => {
    switch (plan) { case "starter": return "default"; case "pro": return "primary"; case "enterprise": return "secondary"; default: return "default"; }
  };
  const statusColor = (status: string) => {
    switch (status) { case "active": return "success"; case "trial": return "warning"; case "expired": return "danger"; default: return "default"; }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Overview</h1>
          <p className="text-xs text-gray-500">Platform Kehadiran — Super Admin Panel</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">System Online</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsConfig.map((stat, i) => {
            const Icon = stat.icon;
            const val = data?.stats?.[stat.key] ?? 0;
            return (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon size={20} weight="fill" className={stat.iconColor} />
                  </div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-7 w-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatValue(stat.key, val, stat.isCurrency)}</p>
                )}
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{stat.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Tenants */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Sekolah Terbaru</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Pendaftaran terbaru</p>
              </div>
              <Button as={Link} href="/admin/tenants" size="sm" variant="light" className="text-blue-400 font-medium text-xs" endContent={<ArrowRight size={14} />}>
                Lihat Semua
              </Button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" /><Skeleton className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" /></div>
                  </div>
                ))
              ) : data?.recentTenants?.length > 0 ? (
                data.recentTenants.map((tenant: any) => (
                  <div key={tenant.id} className="px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Buildings size={16} className="text-blue-400" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tenant.nama}</p>
                      <p className="text-[10px] text-gray-500">{tenant.siswa} siswa &middot; {timeAgo(tenant.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Chip size="sm" color={planColor(tenant.plan)} variant="flat" className="text-[10px] capitalize">{tenant.plan}</Chip>
                      <Chip size="sm" color={statusColor(tenant.status)} variant="flat" className="text-[10px] capitalize hidden sm:inline-flex">{tenant.status}</Chip>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-gray-400 dark:text-gray-600 text-sm">Belum ada sekolah terdaftar</div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Email Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Email SMTP</h3>
                <Button as={Link} href="/admin/smtp" size="sm" variant="light" className="text-blue-400 text-xs">Konfigurasi</Button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Terkirim", value: data?.emailStats?.sent ?? 0, icon: CheckCircle, color: "text-emerald-400" },
                  { label: "Gagal", value: data?.emailStats?.failed ?? 0, icon: XCircle, color: "text-red-400" },
                  { label: "Pending", value: data?.emailStats?.pending ?? 0, icon: Clock, color: "text-amber-400" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={16} weight="fill" className={stat.color} />
                        <span className="text-xs text-gray-400">{stat.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{isLoading ? "..." : stat.value.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Aksi Cepat</h3>
              <div className="space-y-2">
                {[
                  { label: "Tambah Sekolah", href: "/admin/tenants", icon: Buildings, color: "bg-blue-500/10 text-blue-400" },
                  { label: "Konfigurasi SMTP", href: "/admin/smtp", icon: Envelope, color: "bg-emerald-500/10 text-emerald-400" },
                  { label: "Lihat Invoices", href: "/admin/invoices", icon: CreditCard, color: "bg-amber-500/10 text-amber-400" },
                  { label: "Audit Log", href: "/admin/audit", icon: ChartLineUp, color: "bg-purple-500/10 text-purple-400" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors no-underline"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                        <Icon size={16} weight="fill" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{action.label}</span>
                      <ArrowRight size={12} className="text-gray-600 ml-auto" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Revenue Bulanan</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">6 bulan terakhir</p>
            </div>
            <ChartLineUp size={20} className="text-gray-600" />
          </div>
          <div className="flex items-end gap-3 h-32">
            {[
              { month: "Sep", value: 58 },
              { month: "Okt", value: 64 },
              { month: "Nov", value: 61 },
              { month: "Des", value: 70 },
              { month: "Jan", value: 72 },
              { month: "Feb", value: 76 },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-600/20 rounded-t-lg hover:bg-blue-600/30 transition-colors relative group"
                  style={{ height: `${(item.value / 80) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Rp {item.value}jt
                  </div>
                </div>
                <span className="text-[10px] text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
