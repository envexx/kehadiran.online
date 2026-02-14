"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { TopBar } from "@/components/top-bar";
import { useNotifikasi, useNotifikasiStats } from "@/hooks/use-swr-hooks";
import { 
  MagnifyingGlass,
  WhatsappLogo,
  CheckCircle,
  XCircle,
  Clock,
  PaperPlaneTilt,
  ArrowClockwise,
  Funnel
} from "phosphor-react";

export default function NotifikasiPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data: notifData, isLoading } = useNotifikasi({ status: statusFilter || undefined, page, limit: 20 });
  const { data: statsData } = useNotifikasiStats();

  const notifications = notifData?.data || [];
  const totalPages = Math.ceil((notifData?.total || 0) / 20);

  const stats = [
    { label: "Terkirim", value: statsData ? statsData.sent.toLocaleString() : "—", icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Pending", value: statsData ? statsData.pending.toLocaleString() : "—", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Gagal", value: statsData ? statsData.failed.toLocaleString() : "—", icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  const statusConfig = (status: string) => {
    switch (status) {
      case "sent": return { label: "Terkirim", color: "success" as const };
      case "pending": return { label: "Pending", color: "warning" as const };
      case "failed": return { label: "Gagal", color: "danger" as const };
      default: return { label: status, color: "default" as const };
    }
  };

  const jenisColor = (jenis: string) => {
    switch (jenis) {
      case "Hadir": return "bg-emerald-50 text-emerald-700";
      case "Terlambat": return "bg-amber-50 text-amber-700";
      case "Alpha": return "bg-red-50 text-red-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Notifikasi WhatsApp" subtitle="Log pengiriman notifikasi ke orang tua" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon size={18} weight="fill" className={stat.iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Notification Log */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
            <div className="flex items-center gap-3 flex-1">
              <Input
                placeholder="Cari siswa atau nomor..."
                size="sm"
                startContent={<MagnifyingGlass size={16} className="text-gray-400" />}
                classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none h-9", input: "text-sm" }}
                className="max-w-xs"
              />
              <Select placeholder="Semua Status" size="sm" className="max-w-[140px]" classNames={{ trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9" }}>
                <SelectItem key="sent">Terkirim</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="failed">Gagal</SelectItem>
              </Select>
              <Select placeholder="Semua Jenis" size="sm" className="max-w-[140px]" classNames={{ trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9" }}>
                <SelectItem key="hadir">Hadir</SelectItem>
                <SelectItem key="terlambat">Terlambat</SelectItem>
                <SelectItem key="alpha">Alpha</SelectItem>
              </Select>
            </div>
            <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<ArrowClockwise size={14} />}>
              Kirim Ulang Gagal
            </Button>
          </div>

          <div className="divide-y divide-gray-50">
            {notifications.length === 0 && !isLoading && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-400">Belum ada notifikasi</p>
              </div>
            )}
            {notifications.map((notif: { id: string; siswa: string; nomor_tujuan: string; jenis: string; pesan: string; status: string; sent_at: string | null }) => {
              const sc = statusConfig(notif.status);
              return (
                <div key={notif.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <WhatsappLogo size={18} className="text-green-600" weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900">{notif.siswa}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${jenisColor(notif.jenis || '')}`}>
                        {notif.jenis}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{notif.pesan}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 font-mono">{notif.nomor_tujuan}</span>
                    <Chip size="sm" variant="flat" color={sc.color} className="text-[10px]">
                      {sc.label}
                    </Chip>
                    <span className="text-xs text-gray-400">{notif.sent_at ? new Date(notif.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                    {notif.status === "failed" && (
                      <Button isIconOnly size="sm" variant="light" className="text-blue-600">
                        <ArrowClockwise size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50">
            <p className="text-xs text-gray-400">Menampilkan {notifications.length} dari {notifData?.total || 0} notifikasi</p>
            <Pagination total={totalPages || 1} page={page} onChange={setPage} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
