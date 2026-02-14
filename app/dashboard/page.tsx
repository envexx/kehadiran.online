"use client";

import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { useDashboardStats, useRecentAttendance } from "@/hooks/use-swr-hooks";
import { 
  TrendUp,
  TrendDown,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Download,
  Plus,
  QrCode,
  ArrowRight,
  ChartLineUp,
  Student
} from "phosphor-react";

export default function DashboardPage() {
  const { data: dashData, isLoading: statsLoading } = useDashboardStats();
  const { data: recentData, isLoading: recentLoading } = useRecentAttendance(undefined, 5);

  const stats = [
    {
      id: 1,
      title: "Total Siswa",
      value: dashData ? dashData.totalSiswa.toLocaleString() : "—",
      change: "+12%",
      trend: "up",
      icon: Student,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Hadir Hari Ini",
      value: dashData ? dashData.hadirHariIni.toLocaleString() : "—",
      change: `+${dashData ? (dashData.persentaseKehadiran - dashData.persentaseKemarin).toFixed(1) : "0"}%`,
      trend: "up",
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: 3,
      title: "Terlambat",
      value: dashData ? dashData.terlambatHariIni.toLocaleString() : "—",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      id: 4,
      title: "Alpha",
      value: dashData ? dashData.alphaHariIni.toLocaleString() : "—",
      change: "-8.3%",
      trend: "down",
      icon: XCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  const recentAttendance = recentData?.data || [];

  const weeklyData = dashData?.trendMingguan?.map((d: { hari: string; hadir: number }) => ({
    day: d.hari,
    percentage: Math.round((d.hadir / (dashData?.totalSiswa || 1)) * 100),
  })) || [];

  const currentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "Hadir": return "success";
      case "Terlambat": return "warning";
      case "Alpha": return "danger";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar showSearch searchPlaceholder="Cari siswa, kelas, atau NIS..." />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px] mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{currentDate}</p>
          </div>
          <div className="flex gap-2">
            <Button
              as={Link}
              href="/presensi"
              size="sm"
              variant="bordered"
              className="border-gray-200 text-gray-700"
              startContent={<QrCode size={16} />}
            >
              Scan QR
            </Button>
            <Button
              as={Link}
              href="/presensi"
              size="sm"
              color="primary"
              className="bg-blue-600 font-medium"
              startContent={<Plus size={16} weight="bold" />}
            >
              Input Presensi
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.trend === "up";
            
            return (
              <div key={stat.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3.5 sm:p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon size={18} weight="fill" className={stat.iconColor} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                    {isUp ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{stat.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Attendance Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <h2 className="font-semibold text-gray-900">Presensi Terbaru</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Update real-time hari ini</p>
                </div>
                <Button
                  as={Link}
                  href="/presensi"
                  size="sm"
                  variant="light"
                  className="text-blue-600 font-medium"
                  endContent={<ArrowRight size={14} />}
                >
                  Lihat Semua
                </Button>
              </div>
              {recentLoading ? (
                <div className="p-6 space-y-4">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-32 h-3 rounded" />
                        <Skeleton className="w-20 h-2 rounded" />
                      </div>
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <Table 
                  removeWrapper
                  aria-label="Tabel presensi terbaru"
                  classNames={{
                    th: "bg-gray-50/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider",
                    td: "py-3",
                  }}
                >
                  <TableHeader>
                    <TableColumn>Siswa</TableColumn>
                    <TableColumn className="hidden sm:table-cell">Kelas</TableColumn>
                    <TableColumn className="hidden sm:table-cell">Waktu</TableColumn>
                    <TableColumn>Status</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {recentAttendance.map((item: { id: string; nama: string; kelas: string; waktu: string; status: string }) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar name={item.nama} size="sm" className="w-7 h-7 sm:w-8 sm:h-8" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-900">{item.nama}</p>
                              <p className="text-[10px] sm:text-xs text-gray-400">{item.kelas} <span className="sm:hidden">&middot; {item.waktu}</span></p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-gray-600">{item.kelas}</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-gray-500">{item.waktu}</span>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" color={statusColor(item.status)} variant="flat" className="text-[10px] sm:text-xs">
                            {item.status}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Weekly Attendance */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Kehadiran Minggu Ini</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Rata-rata: 93.4%</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ChartLineUp size={16} className="text-blue-600" weight="fill" />
                </div>
              </div>
              <div className="space-y-3">
                {weeklyData.map((item: { day: string; percentage: number }, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 w-8">{item.day}</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            item.percentage >= 95 ? 'bg-emerald-500' : 
                            item.percentage >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-10 text-right">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4">Aksi Cepat</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Scan QR", icon: QrCode, href: "/presensi", color: "bg-blue-50 text-blue-600" },
                  { label: "Export", icon: Download, href: "/laporan", color: "bg-emerald-50 text-emerald-600" },
                  { label: "Jadwal", icon: Calendar, href: "/jadwal", color: "bg-amber-50 text-amber-600" },
                  { label: "Siswa", icon: Users, href: "/siswa", color: "bg-purple-50 text-purple-600" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Icon size={20} weight="fill" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Class Attendance Grid */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900">Kehadiran Per Kelas</h2>
              <p className="text-xs text-gray-400 mt-0.5">Ringkasan kehadiran hari ini</p>
            </div>
            <Button
              as={Link}
              href="/kelas"
              size="sm"
              variant="light"
              className="text-blue-600 font-medium"
              endContent={<ArrowRight size={14} />}
            >
              Semua Kelas
            </Button>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { kelas: "XII RPL 1", total: 36, hadir: 34, izin: 1, alpha: 1, persentase: 94.4 },
                { kelas: "XII RPL 2", total: 35, hadir: 33, izin: 2, alpha: 0, persentase: 94.3 },
                { kelas: "XI RPL 1", total: 38, hadir: 36, izin: 1, alpha: 1, persentase: 94.7 },
                { kelas: "XI RPL 2", total: 36, hadir: 34, izin: 2, alpha: 0, persentase: 94.4 },
              ].map((kelas, index) => (
                <div key={index} className="p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{kelas.kelas}</h4>
                    <span className={`text-sm font-bold ${
                      kelas.persentase >= 95 ? 'text-emerald-600' : 
                      kelas.persentase >= 90 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {kelas.persentase}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div 
                      className={`h-1.5 rounded-full ${
                        kelas.persentase >= 95 ? 'bg-emerald-500' : 
                        kelas.persentase >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${kelas.persentase}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
                    <span className="text-gray-400">{kelas.total} siswa</span>
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

