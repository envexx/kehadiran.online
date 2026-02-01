"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { 
  MagnifyingGlass, 
  Bell, 
  QrCode,
  Fingerprint,
  Camera,
  CheckCircle,
  XCircle,
  Clock
} from "phosphor-react";

export default function PresensiPage() {
  const currentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const recentScans = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-divider/50 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Input Presensi</h1>
          <p className="text-sm text-default-500">{currentDate} • {currentTime}</p>
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

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Input Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold">Metode Input Presensi</h2>
              </CardHeader>
              <CardBody>
                <Tabs aria-label="Metode Presensi" color="primary" size="lg">
                  <Tab 
                    key="qr" 
                    title={
                      <div className="flex items-center gap-2">
                        <QrCode size={20} />
                        <span>QR Code</span>
                      </div>
                    }
                  >
                    <div className="py-8 space-y-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-80 h-80 bg-default-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-default-300">
                          <div className="text-center space-y-4">
                            <QrCode size={120} className="mx-auto text-default-400" />
                            <p className="text-default-500">Arahkan QR Code ke kamera</p>
                            <Button color="primary" startContent={<Camera size={20} />}>
                              Aktifkan Kamera
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab 
                    key="fingerprint" 
                    title={
                      <div className="flex items-center gap-2">
                        <Fingerprint size={20} />
                        <span>Sidik Jari</span>
                      </div>
                    }
                  >
                    <div className="py-8 space-y-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-80 h-80 bg-default-100 rounded-2xl flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <Fingerprint size={120} className="mx-auto text-default-400" />
                            <p className="text-default-500">Tempelkan jari ke scanner</p>
                            <Chip color="success" variant="flat">Device Ready</Chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab 
                    key="manual" 
                    title={
                      <div className="flex items-center gap-2">
                        <MagnifyingGlass size={20} />
                        <span>Manual</span>
                      </div>
                    }
                  >
                    <div className="py-8 space-y-6">
                      <div className="space-y-4">
                        <Input
                          label="Cari Siswa (NIS/Nama)"
                          placeholder="Ketik NIS atau nama siswa..."
                          size="lg"
                          startContent={<MagnifyingGlass size={20} />}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Select label="Kelas" placeholder="Pilih kelas" size="lg">
                            <SelectItem key="12rpl1">XII RPL 1</SelectItem>
                            <SelectItem key="12rpl2">XII RPL 2</SelectItem>
                            <SelectItem key="11rpl1">XI RPL 1</SelectItem>
                            <SelectItem key="11rpl2">XI RPL 2</SelectItem>
                          </Select>
                          
                          <Select label="Status" placeholder="Pilih status" size="lg">
                            <SelectItem key="hadir">Hadir</SelectItem>
                            <SelectItem key="izin">Izin</SelectItem>
                            <SelectItem key="sakit">Sakit</SelectItem>
                            <SelectItem key="alpha">Alpha</SelectItem>
                          </Select>
                        </div>

                        <Input
                          label="Keterangan (Opsional)"
                          placeholder="Tambahkan keterangan jika diperlukan"
                          size="lg"
                        />

                        <Button color="primary" size="lg" className="w-full">
                          Simpan Presensi
                        </Button>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>

          {/* Right - Recent Scans */}
          <div className="space-y-6">
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader className="justify-between">
                <h3 className="font-bold">Scan Terbaru</h3>
                <Chip size="sm" color="success" variant="flat">
                  Live
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {recentScans.map((scan) => (
                    <div 
                      key={scan.id}
                      className="flex items-center gap-3 p-3 bg-default-50 rounded-lg"
                    >
                      <Avatar src={scan.foto} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{scan.name}</p>
                        <p className="text-xs text-default-400">{scan.nis} • {scan.kelas}</p>
                      </div>
                      <div className="text-right">
                        <Chip size="sm" color="success" variant="flat" startContent={<CheckCircle size={14} />}>
                          Hadir
                        </Chip>
                        <p className="text-xs text-default-400 mt-1">{scan.waktu}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Quick Stats */}
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader>
                <h3 className="font-bold">Statistik Hari Ini</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-success" weight="fill" />
                    <span className="text-sm font-medium">Hadir</span>
                  </div>
                  <span className="text-lg font-bold">1,180</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-warning" weight="fill" />
                    <span className="text-sm font-medium">Izin/Sakit</span>
                  </div>
                  <span className="text-lg font-bold">45</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle size={20} className="text-danger" weight="fill" />
                    <span className="text-sm font-medium">Alpha</span>
                  </div>
                  <span className="text-lg font-bold">23</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

