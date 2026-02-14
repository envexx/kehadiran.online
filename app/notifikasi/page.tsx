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
  const stats = [
    { label: "Terkirim", value: "12,450", icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Pending", value: "23", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Gagal", value: "8", icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  const notifications = [
    { id: 1, siswa: "Ahmad Rizki Maulana", tujuan: "6281234567890", jenis: "Hadir", pesan: "Ahmad Rizki telah hadir di sekolah pada 08:15", status: "sent", waktu: "08:15:30" },
    { id: 2, siswa: "Siti Nurhaliza", tujuan: "6281234567891", jenis: "Hadir", pesan: "Siti Nurhaliza telah hadir di sekolah pada 08:14", status: "sent", waktu: "08:14:15" },
    { id: 3, siswa: "Budi Santoso", tujuan: "6281234567892", jenis: "Terlambat", pesan: "Budi Santoso terlambat hadir di sekolah pada 08:35", status: "sent", waktu: "08:35:22" },
    { id: 4, siswa: "Dewi Lestari", tujuan: "6281234567893", jenis: "Alpha", pesan: "Dewi Lestari tidak hadir di sekolah hari ini", status: "pending", waktu: "09:00:00" },
    { id: 5, siswa: "Eko Prasetyo", tujuan: "6281234567894", jenis: "Hadir", pesan: "Eko Prasetyo telah hadir di sekolah pada 08:11", status: "sent", waktu: "08:11:45" },
    { id: 6, siswa: "Fitri Handayani", tujuan: "6281234567895", jenis: "Alpha", pesan: "Fitri Handayani tidak hadir di sekolah hari ini", status: "failed", waktu: "09:00:05" },
    { id: 7, siswa: "Gilang Ramadhan", tujuan: "6281234567896", jenis: "Hadir", pesan: "Gilang Ramadhan telah hadir di sekolah pada 07:55", status: "sent", waktu: "07:55:10" },
    { id: 8, siswa: "Hani Rahmawati", tujuan: "6281234567897", jenis: "Hadir", pesan: "Hani Rahmawati telah hadir di sekolah pada 08:02", status: "sent", waktu: "08:02:33" },
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
            {notifications.map((notif) => {
              const sc = statusConfig(notif.status);
              return (
                <div key={notif.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <WhatsappLogo size={18} className="text-green-600" weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900">{notif.siswa}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${jenisColor(notif.jenis)}`}>
                        {notif.jenis}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{notif.pesan}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 font-mono">{notif.tujuan}</span>
                    <Chip size="sm" variant="flat" color={sc.color} className="text-[10px]">
                      {sc.label}
                    </Chip>
                    <span className="text-xs text-gray-400">{notif.waktu}</span>
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
            <p className="text-xs text-gray-400">Menampilkan 1-8 dari 12,481 notifikasi</p>
            <Pagination total={1560} initialPage={1} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
