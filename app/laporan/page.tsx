"use client";

import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { TopBar } from "@/components/top-bar";
import { useLaporan } from "@/hooks/use-swr-hooks";
import { 
  Download,
  Printer,
  ChartLineUp,
  TrendUp,
  TrendDown,
  CheckCircle,
  XCircle,
  Clock,
  FilePdf,
  FileXls,
  CalendarBlank,
  Funnel
} from "phosphor-react";

export default function LaporanPage() {
  const { data: laporanData, isLoading } = useLaporan();

  const classReport: { kelas: string; siswa: number; hadir: number; izin: number; alpha: number; persentase: number }[] =
    laporanData?.perKelas?.map((k: { kelas: string; hadir: number; siswa: number }) => ({
      kelas: k.kelas,
      siswa: k.siswa,
      hadir: Math.round((k.hadir / 100) * k.siswa),
      izin: 0,
      alpha: 0,
      persentase: k.hadir,
    })) || [];

  const stats = [
    { label: "Rata-rata Kehadiran", value: laporanData ? `${laporanData.rataRataKehadiran}%` : "—", change: "", trend: "up", icon: ChartLineUp, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Total Hadir", value: laporanData ? laporanData.totalHadir.toLocaleString() : "—", change: "", trend: "up", icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Total Izin/Sakit", value: laporanData ? (laporanData.totalIzin + laporanData.totalSakit).toLocaleString() : "—", change: "", trend: "down", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Total Alpha", value: laporanData ? laporanData.totalAlpha.toLocaleString() : "—", change: "", trend: "down", icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Laporan Presensi" subtitle="Analisis dan statistik kehadiran siswa" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Filter & Export */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <Select label="Tahun Ajaran" placeholder="Pilih" defaultSelectedKeys={["2024"]} size="sm" className="w-[140px]" classNames={{ trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9" }}>
                <SelectItem key="2024">2024/2025</SelectItem>
                <SelectItem key="2023">2023/2024</SelectItem>
              </Select>
              <Select label="Semester" placeholder="Pilih" defaultSelectedKeys={["genap"]} size="sm" className="w-[120px]" classNames={{ trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9" }}>
                <SelectItem key="genap">Genap</SelectItem>
                <SelectItem key="ganjil">Ganjil</SelectItem>
              </Select>
              <Select label="Kelas" placeholder="Semua" size="sm" className="w-[140px]" classNames={{ trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9" }}>
                <SelectItem key="all">Semua Kelas</SelectItem>
                <SelectItem key="12rpl1">XII RPL 1</SelectItem>
                <SelectItem key="12rpl2">XII RPL 2</SelectItem>
              </Select>
              <Input label="Dari Tanggal" type="date" size="sm" className="w-[160px]" classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none h-9" }} />
              <Input label="Sampai Tanggal" type="date" size="sm" className="w-[160px]" classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none h-9" }} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<FilePdf size={14} />}>
                Export PDF
              </Button>
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<FileXls size={14} />}>
                Export Excel
              </Button>
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<Printer size={14} />}>
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isUp = stat.trend === "up";
            return (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon size={20} weight="fill" className={stat.iconColor} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                    {isUp ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-900">Tren Kehadiran Bulanan</h3>
              <p className="text-xs text-gray-400 mt-0.5">Data kehadiran per bulan</p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => <Skeleton key={i} className="w-full h-8 rounded" />)}
                </div>
              ) : classReport.length > 0 ? (
                <div className="space-y-4">
                  {classReport.slice(0, 5).map((data, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-xs font-medium text-gray-500">{data.kelas}</span>
                        <span className="text-xs font-semibold text-emerald-600">{data.persentase}%</span>
                      </div>
                      <div className="flex gap-0.5 h-6 rounded-lg overflow-hidden">
                        <div className="bg-emerald-500 rounded-l-lg flex items-center justify-center" style={{ width: `${Math.max(data.persentase, 1)}%` }}>
                          <span className="text-[9px] text-white font-medium">Hadir</span>
                        </div>
                        {(100 - data.persentase) > 0 && (
                          <div className="bg-red-400 rounded-r-lg flex items-center justify-center" style={{ width: `${100 - data.persentase}%` }}>
                            <span className="text-[9px] text-white font-medium">{(100 - data.persentase).toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Hadir</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-400" /> Tidak Hadir</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">Belum ada data presensi</p>
                </div>
              )}
            </div>
          </div>

          {/* Class Report */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-900">Laporan Per Kelas</h3>
              <p className="text-xs text-gray-400 mt-0.5">Rata-rata kehadiran hari ini</p>
            </div>
            <div className="p-6 space-y-3">
              {classReport.map((kelas, index) => (
                <div key={index} className="p-3 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-900">{kelas.kelas}</span>
                    <span className={`text-sm font-bold ${
                      kelas.persentase >= 95 ? 'text-emerald-600' : 
                      kelas.persentase >= 90 ? 'text-blue-600' : 'text-amber-600'
                    }`}>{kelas.persentase}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                    <div 
                      className={`h-1.5 rounded-full ${
                        kelas.persentase >= 95 ? 'bg-emerald-500' : 
                        kelas.persentase >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${kelas.persentase}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{kelas.siswa} siswa</span>
                    <span className="text-emerald-600">{kelas.hadir} hadir</span>
                    {kelas.izin > 0 && <span className="text-amber-600">{kelas.izin} izin</span>}
                    {kelas.alpha > 0 && <span className="text-red-500">{kelas.alpha} alpha</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

