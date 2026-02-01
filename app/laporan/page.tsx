"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { 
  Bell,
  Download,
  Printer,
  ChartLine,
  TrendUp,
  TrendDown,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from "phosphor-react";

export default function LaporanPage() {
  const monthlyData = [
    { bulan: "Januari", hadir: 95.2, izin: 3.1, alpha: 1.7 },
    { bulan: "Februari", hadir: 94.8, izin: 3.5, alpha: 1.7 },
    { bulan: "Maret", hadir: 96.1, izin: 2.8, alpha: 1.1 },
    { bulan: "April", hadir: 93.5, izin: 4.2, alpha: 2.3 },
    { bulan: "Mei", hadir: 94.9, izin: 3.3, alpha: 1.8 },
  ];

  const classReport = [
    { kelas: "XII RPL 1", siswa: 36, hadir: 34, izin: 1, alpha: 1, persentase: 94.4 },
    { kelas: "XII RPL 2", siswa: 35, hadir: 33, izin: 2, alpha: 0, persentase: 94.3 },
    { kelas: "XI RPL 1", siswa: 38, hadir: 36, izin: 1, alpha: 1, persentase: 94.7 },
    { kelas: "XI RPL 2", siswa: 36, hadir: 34, izin: 2, alpha: 0, persentase: 94.4 },
    { kelas: "X RPL 1", siswa: 40, hadir: 38, izin: 1, alpha: 1, persentase: 95.0 },
    { kelas: "X RPL 2", siswa: 38, hadir: 36, izin: 1, alpha: 1, persentase: 94.7 },
  ];

  const stats = [
    {
      label: "Rata-rata Kehadiran",
      value: "94.2%",
      change: "+2.3%",
      trend: "up",
      icon: ChartLine,
      color: "success"
    },
    {
      label: "Total Hadir Bulan Ini",
      value: "23,450",
      change: "+5.1%",
      trend: "up",
      icon: CheckCircle,
      color: "success"
    },
    {
      label: "Total Izin/Sakit",
      value: "892",
      change: "-1.2%",
      trend: "down",
      icon: Clock,
      color: "warning"
    },
    {
      label: "Total Alpha",
      value: "458",
      change: "-3.5%",
      trend: "down",
      icon: XCircle,
      color: "danger"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-divider/50 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laporan Presensi</h1>
          <p className="text-sm text-default-500">Analisis dan statistik kehadiran siswa</p>
        </div>
        <div className="flex items-center gap-4">
          <Button color="primary" startContent={<Download size={20} />}>
            Export PDF
          </Button>
          <Button variant="bordered" startContent={<Printer size={20} />}>
            Print
          </Button>
          <Button isIconOnly variant="light" className="rounded-full relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
          </Button>
          <div className="flex items-center gap-3 pl-4 border-l">
            <Avatar
              src="https://i.pravatar.cc/150?u=admin"
              size="md"
            />
            <div>
              <p className="text-sm font-semibold">Admin Sekolah</p>
              <p className="text-xs text-default-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-6">
        {/* Filter Section */}
        <Card className="border border-divider/50 shadow-sm">
          <CardBody className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Select label="Tahun Ajaran" placeholder="Pilih tahun" defaultSelectedKeys={["2024"]} className="max-w-xs">
                <SelectItem key="2024">2024/2025</SelectItem>
                <SelectItem key="2023">2023/2024</SelectItem>
                <SelectItem key="2022">2022/2023</SelectItem>
              </Select>
              <Select label="Semester" placeholder="Pilih semester" defaultSelectedKeys={["genap"]} className="max-w-xs">
                <SelectItem key="genap">Genap</SelectItem>
                <SelectItem key="ganjil">Ganjil</SelectItem>
              </Select>
              <Select label="Kelas" placeholder="Semua Kelas" className="max-w-xs">
                <SelectItem key="all">Semua Kelas</SelectItem>
                <SelectItem key="12rpl1">XII RPL 1</SelectItem>
                <SelectItem key="12rpl2">XII RPL 2</SelectItem>
              </Select>
              <Button color="primary">Terapkan Filter</Button>
            </div>
          </CardBody>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendUp : TrendDown;
            
            return (
              <Card key={index} className="border border-divider/50 shadow-sm">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                      <Icon size={24} weight="fill" className={`text-${stat.color}`} />
                    </div>
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color={stat.trend === "up" ? "success" : "danger"}
                      startContent={<TrendIcon size={14} weight="bold" />}
                    >
                      {stat.change}
                    </Chip>
                  </div>
                  <p className="text-sm text-default-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card className="border border-divider/50 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-bold">Tren Kehadiran Bulanan</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.bulan}</span>
                      <span className="text-success font-semibold">{data.hadir}%</span>
                    </div>
                    <div className="flex gap-1">
                      <div 
                        className="h-8 bg-success rounded-lg flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${data.hadir}%` }}
                      >
                        Hadir
                      </div>
                      <div 
                        className="h-8 bg-warning rounded-lg flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${data.izin}%` }}
                      >
                        Izin
                      </div>
                      <div 
                        className="h-8 bg-danger rounded-lg flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${data.alpha}%` }}
                      >
                        Alpha
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Class Report */}
          <Card className="border border-divider/50 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-bold">Laporan Per Kelas</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {classReport.map((kelas, index) => (
                  <Card key={index} className="border border-divider/50">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Users size={20} className="text-primary" weight="fill" />
                          <span className="font-bold">{kelas.kelas}</span>
                        </div>
                        <Chip size="sm" color="primary" variant="flat">
                          {kelas.persentase}%
                        </Chip>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-default-500">Total: {kelas.siswa}</span>
                        <div className="flex gap-3">
                          <span className="text-success">✓ {kelas.hadir}</span>
                          <span className="text-warning">⏰ {kelas.izin}</span>
                          <span className="text-danger">✗ {kelas.alpha}</span>
                        </div>
                      </div>
                      <div className="w-full bg-default-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-success"
                          style={{ width: `${kelas.persentase}%` }}
                        />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

