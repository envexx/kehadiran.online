"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { TopBar } from "@/components/top-bar";
import { useLaporan } from "@/hooks/use-swr-hooks";
import { 
  Printer,
  ChartLineUp,
  CheckCircle,
  XCircle,
  Clock,
  FileXls,
  Funnel,
  ArrowClockwise
} from "phosphor-react";

export default function LaporanPage() {
  const [kelasList, setKelasList] = useState<{id:string;nama_kelas:string}[]>([]);
  const [filterKelas, setFilterKelas] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/kelas").then(r => r.json()).then(d => { if (d.data) setKelasList(d.data); }).catch(() => {});
  }, []);

  const { data: laporanData, isLoading } = useLaporan({
    kelasId: filterKelas || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const classReport: { kelas: string; kelasId: string; siswa: number; hadir: number; izin: number; sakit: number; alpha: number; persentase: number }[] =
    laporanData?.perKelas?.map((k: { kelas: string; kelasId: string; hadir: number; izin: number; sakit: number; alpha: number; siswa: number }) => ({
      kelas: k.kelas,
      kelasId: k.kelasId,
      siswa: k.siswa,
      hadir: Math.round((k.hadir / 100) * k.siswa),
      izin: k.izin,
      sakit: k.sakit,
      alpha: k.alpha,
      persentase: k.hadir,
    })) || [];

  const stats = [
    { label: "Rata-rata Kehadiran", value: laporanData ? `${laporanData.rataRataKehadiran}%` : "—", icon: ChartLineUp, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Total Hadir", value: laporanData ? laporanData.totalHadir.toLocaleString() : "—", icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Total Izin/Sakit", value: laporanData ? (laporanData.totalIzin + laporanData.totalSakit).toLocaleString() : "—", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Total Alpha", value: laporanData ? laporanData.totalAlpha.toLocaleString() : "—", icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (filterKelas) params.set("kelasId", filterKelas);
      const query = params.toString();
      const res = await fetch(`/api/laporan/export${query ? `?${query}` : ""}`);
      if (!res.ok) { setExporting(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateLabel = startDate && endDate ? `${startDate}_${endDate}` : "semua";
      a.download = `Laporan_Presensi_${dateLabel}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
    setExporting(false);
  };

  const handlePrint = () => { window.print(); };

  const resetFilters = () => {
    setFilterKelas("");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = filterKelas || startDate || endDate;

  const dateRangeLabel = startDate && endDate
    ? `${new Date(startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} — ${new Date(endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`
    : startDate ? `Dari ${new Date(startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`
    : endDate ? `Sampai ${new Date(endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`
    : "Semua waktu";

  return (
    <div className="min-h-screen">
      <TopBar title="Laporan Presensi" subtitle="Analisis dan statistik kehadiran siswa" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Filter & Export */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <Select
                label="Kelas"
                placeholder="Semua Kelas"
                size="sm"
                className="w-[160px]"
                selectedKeys={filterKelas ? [filterKelas] : []}
                onChange={(e) => setFilterKelas(e.target.value)}
                classNames={{ trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9" }}
              >
                {kelasList.map((k) => <SelectItem key={k.id}>{k.nama_kelas}</SelectItem>)}
              </Select>
              <Input
                label="Dari Tanggal"
                type="date"
                size="sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[160px]"
                classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none h-9" }}
              />
              <Input
                label="Sampai Tanggal"
                type="date"
                size="sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[160px]"
                classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none h-9" }}
              />
              {hasFilters && (
                <Button size="sm" variant="light" className="text-gray-500 h-9" startContent={<ArrowClockwise size={14} />} onPress={resetFilters}>
                  Reset
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<FileXls size={14} />} isLoading={exporting} onPress={handleExportCSV}>
                Export CSV
              </Button>
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<Printer size={14} />} onPress={handlePrint}>
                Print
              </Button>
            </div>
          </div>
          {hasFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
              <Funnel size={14} className="text-blue-500" />
              <span className="text-xs text-gray-500">
                Filter aktif: <strong className="text-gray-700">{dateRangeLabel}</strong>
                {filterKelas && <> · <strong className="text-gray-700">{kelasList.find(k => k.id === filterKelas)?.nama_kelas || "Kelas"}</strong></>}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon size={20} weight="fill" className={stat.iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{isLoading ? "—" : stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-900">Perbandingan Kehadiran Per Kelas</h3>
              <p className="text-xs text-gray-400 mt-0.5">{dateRangeLabel}</p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => <Skeleton key={i} className="w-full h-8 rounded" />)}
                </div>
              ) : classReport.length > 0 ? (
                <div className="space-y-4">
                  {classReport.map((data, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-xs font-medium text-gray-500">{data.kelas}</span>
                        <span className="text-xs font-semibold text-emerald-600">{data.persentase}%</span>
                      </div>
                      <div className="flex gap-0.5 h-6 rounded-lg overflow-hidden">
                        <div className="bg-emerald-500 rounded-l-lg flex items-center justify-center" style={{ width: `${Math.max(data.persentase, 1)}%` }}>
                          {data.persentase >= 15 && <span className="text-[9px] text-white font-medium">Hadir</span>}
                        </div>
                        {(100 - data.persentase) > 0 && (
                          <div className="bg-red-400 rounded-r-lg flex items-center justify-center" style={{ width: `${100 - data.persentase}%` }}>
                            {(100 - data.persentase) >= 15 && <span className="text-[9px] text-white font-medium">{(100 - data.persentase).toFixed(1)}%</span>}
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
              <p className="text-xs text-gray-400 mt-0.5">{dateRangeLabel}</p>
            </div>
            <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <Skeleton key={i} className="w-full h-20 rounded-xl" />)}
                </div>
              ) : classReport.length > 0 ? classReport.map((kelas, index) => (
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
                    {(kelas.izin + kelas.sakit) > 0 && <span className="text-amber-600">{kelas.izin + kelas.sakit} izin/sakit</span>}
                    {kelas.alpha > 0 && <span className="text-red-500">{kelas.alpha} alpha</span>}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">Belum ada data presensi</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
