"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { 
  MagnifyingGlass, 
  Bell, 
  DotsThree,
  TrendUp,
  TrendDown,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Download,
  Funnel,
  Plus,
  ClipboardText
} from "phosphor-react";

export default function DashboardPage() {
  const stats = [
    {
      id: 1,
      title: "Total Siswa",
      value: "1,248",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
      bgLight: "bg-blue-50"
    },
    {
      id: 2,
      title: "Hadir Hari Ini",
      value: "1,180",
      change: "+5.2%",
      trend: "up",
      icon: CheckCircle,
      color: "bg-success-500",
      bgLight: "bg-success-50"
    },
    {
      id: 3,
      title: "Izin/Sakit",
      value: "45",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      color: "bg-warning-500",
      bgLight: "bg-warning-50"
    },
    {
      id: 4,
      title: "Alpha",
      value: "23",
      change: "-8.3%",
      trend: "down",
      icon: XCircle,
      color: "bg-danger-500",
      bgLight: "bg-danger-50"
    },
  ];

  const recentAttendance = [
    {
      id: 1,
      name: "Ahmad Rizki Maulana",
      nis: "2024001",
      kelas: "XII RPL 1",
      waktu: "08:15:24",
      status: "Hadir",
      foto: "https://i.pravatar.cc/150?u=student1"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      nis: "2024002",
      kelas: "XII RPL 1",
      waktu: "08:14:12",
      status: "Hadir",
      foto: "https://i.pravatar.cc/150?u=student2"
    },
    {
      id: 3,
      name: "Budi Santoso",
      nis: "2024003",
      kelas: "XII RPL 2",
      waktu: "08:13:45",
      status: "Hadir",
      foto: "https://i.pravatar.cc/150?u=student3"
    },
    {
      id: 4,
      name: "Dewi Lestari",
      nis: "2024004",
      kelas: "XII RPL 1",
      waktu: "08:12:33",
      status: "Hadir",
      foto: "https://i.pravatar.cc/150?u=student4"
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      nis: "2024005",
      kelas: "XII RPL 2",
      waktu: "08:11:22",
      status: "Hadir",
      foto: "https://i.pravatar.cc/150?u=student5"
    },
  ];

  const classAttendance = [
    { kelas: "XII RPL 1", total: 36, hadir: 34, izin: 1, alpha: 1, persentase: 94.4 },
    { kelas: "XII RPL 2", total: 35, hadir: 33, izin: 2, alpha: 0, persentase: 94.3 },
    { kelas: "XI RPL 1", total: 38, hadir: 36, izin: 1, alpha: 1, persentase: 94.7 },
    { kelas: "XI RPL 2", total: 36, hadir: 34, izin: 2, alpha: 0, persentase: 94.4 },
  ];

  const weeklyData = [
    { day: "Sen", percentage: 95 },
    { day: "Sel", percentage: 92 },
    { day: "Rab", percentage: 97 },
    { day: "Kam", percentage: 94 },
    { day: "Jum", percentage: 89 },
  ];

  const currentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-divider/50 px-8 py-4 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <Input
            classNames={{
              base: "max-w-full",
              inputWrapper: "border-0 bg-gray-100 hover:bg-gray-200",
            }}
            placeholder="Cari siswa, kelas, atau NIS..."
            size="lg"
            startContent={<MagnifyingGlass size={20} className="text-default-400" />}
            type="search"
          />
        </div>
        <div className="flex items-center gap-4">
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

      <div className="p-8 space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 border-0">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-white space-y-2">
                <h1 className="text-3xl font-bold">Selamat Datang! 👋</h1>
                <p className="text-white/90">{currentDate}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Clock size={20} weight="fill" />
                    <span className="text-sm">08:00 - 15:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} weight="fill" />
                    <span className="text-sm">Semester Genap 2024/2025</span>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-white text-primary-600 font-semibold"
                startContent={<Plus weight="bold" />}
                size="lg"
              >
                Input Presensi Manual
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendUp : TrendDown;
            
            return (
              <Card key={stat.id} className="border border-divider/50 shadow-sm">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgLight} flex items-center justify-center`}>
                      <Icon size={24} weight="fill" className={stat.color.replace('bg-', 'text-')} />
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
                  <p className="text-sm text-default-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Attendance */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader className="justify-between px-6">
                <h2 className="text-xl font-bold">Presensi Terbaru</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat" startContent={<Funnel size={18} />}>
                    Filter
                  </Button>
                  <Button size="sm" variant="flat" color="primary" startContent={<Download size={18} />}>
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="px-0">
                <Table 
                  removeWrapper
                  aria-label="Tabel presensi terbaru"
                  classNames={{
                    th: "bg-default-50",
                  }}
                >
                  <TableHeader>
                    <TableColumn>SISWA</TableColumn>
                    <TableColumn>NIS</TableColumn>
                    <TableColumn>KELAS</TableColumn>
                    <TableColumn>WAKTU</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {recentAttendance.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={item.foto} size="sm" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-default-500">{item.nis}</span>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat">{item.kelas}</Chip>
                        </TableCell>
                        <TableCell>
                          <span className="text-default-500">{item.waktu}</span>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" color="success" variant="flat">
                            {item.status}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
              <CardFooter className="justify-center">
                <Button variant="light" color="primary">
                  Lihat Semua Presensi
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Weekly Chart */}
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader className="justify-between">
                <h3 className="font-bold">Kehadiran Minggu Ini</h3>
                <Button isIconOnly size="sm" variant="light">
                  <DotsThree size={20} weight="bold" />
                </Button>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {weeklyData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.day}</span>
                        <span className="text-primary font-semibold">{item.percentage}%</span>
                      </div>
                      <Progress 
                        value={item.percentage} 
                        color="primary"
                        size="sm"
                        className="max-w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700 font-medium">
                    📊 Rata-rata kehadiran minggu ini: <strong>93.4%</strong>
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader>
                <h3 className="font-bold">Aksi Cepat</h3>
              </CardHeader>
              <CardBody className="gap-2">
                <Button 
                  variant="flat" 
                  color="primary" 
                  className="justify-start"
                  startContent={<ClipboardText size={20} />}
                >
                  Input Presensi Manual
                </Button>
                <Button 
                  variant="flat" 
                  className="justify-start"
                  startContent={<Download size={20} />}
                >
                  Export Laporan
                </Button>
                <Button 
                  variant="flat" 
                  className="justify-start"
                  startContent={<Calendar size={20} />}
                >
                  Atur Jadwal
                </Button>
                <Button 
                  variant="flat" 
                  className="justify-start"
                  startContent={<Users size={20} />}
                >
                  Kelola Siswa
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Class Attendance */}
        <Card className="border border-divider/50 shadow-sm">
          <CardHeader className="justify-between">
            <h2 className="text-xl font-bold">Kehadiran Per Kelas</h2>
            <Button size="sm" variant="light" color="primary">
              Lihat Detail
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {classAttendance.map((kelas, index) => (
                <div key={index} className="p-4 bg-default-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">{kelas.kelas}</h4>
                    <Chip size="sm" color="primary" variant="flat">
                      {kelas.persentase}%
                    </Chip>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-default-500">Total Siswa:</span>
                      <span className="font-semibold">{kelas.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-success-600">Hadir:</span>
                      <span className="font-semibold text-success-600">{kelas.hadir}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warning-600">Izin:</span>
                      <span className="font-semibold text-warning-600">{kelas.izin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-danger-600">Alpha:</span>
                      <span className="font-semibold text-danger-600">{kelas.alpha}</span>
                    </div>
                  </div>
                  <Progress 
                    value={kelas.persentase} 
                    color="success"
                    size="sm"
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

