"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { 
  Bell,
  Plus,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  ClockClockwise,
  Users
} from "phosphor-react";

export default function JadwalPage() {
  const schedule = {
    senin: [
      { id: 1, waktu: "07:30 - 09:00", mapel: "Matematika", kelas: "XII RPL 1", guru: "Pak Budi", ruang: "R.301" },
      { id: 2, waktu: "09:15 - 10:45", mapel: "Bahasa Indonesia", kelas: "XII RPL 1", guru: "Bu Ani", ruang: "R.301" },
      { id: 3, waktu: "11:00 - 12:30", mapel: "Pemrograman Web", kelas: "XII RPL 1", guru: "Pak Dedi", ruang: "Lab 1" },
      { id: 4, waktu: "13:00 - 14:30", mapel: "Basis Data", kelas: "XII RPL 1", guru: "Bu Sari", ruang: "Lab 2" },
    ],
    selasa: [
      { id: 5, waktu: "07:30 - 09:00", mapel: "Bahasa Inggris", kelas: "XII RPL 1", guru: "Bu Rina", ruang: "R.301" },
      { id: 6, waktu: "09:15 - 10:45", mapel: "Pemrograman Mobile", kelas: "XII RPL 1", guru: "Pak Eko", ruang: "Lab 1" },
      { id: 7, waktu: "11:00 - 12:30", mapel: "Jaringan Komputer", kelas: "XII RPL 1", guru: "Pak Ahmad", ruang: "Lab 2" },
    ],
    rabu: [
      { id: 8, waktu: "07:30 - 09:00", mapel: "Matematika", kelas: "XII RPL 1", guru: "Pak Budi", ruang: "R.301" },
      { id: 9, waktu: "09:15 - 10:45", mapel: "PKK", kelas: "XII RPL 1", guru: "Bu Dewi", ruang: "R.301" },
      { id: 10, waktu: "11:00 - 12:30", mapel: "Pemrograman Web", kelas: "XII RPL 1", guru: "Pak Dedi", ruang: "Lab 1" },
    ],
    kamis: [
      { id: 11, waktu: "07:30 - 09:00", mapel: "Pendidikan Agama", kelas: "XII RPL 1", guru: "Pak Hadi", ruang: "R.301" },
      { id: 12, waktu: "09:15 - 10:45", mapel: "Pemrograman Mobile", kelas: "XII RPL 1", guru: "Pak Eko", ruang: "Lab 1" },
      { id: 13, waktu: "11:00 - 12:30", mapel: "Basis Data", kelas: "XII RPL 1", guru: "Bu Sari", ruang: "Lab 2" },
    ],
    jumat: [
      { id: 14, waktu: "07:30 - 09:00", mapel: "Olahraga", kelas: "XII RPL 1", guru: "Pak Joko", ruang: "Lapangan" },
      { id: 15, waktu: "09:15 - 10:45", mapel: "Bahasa Inggris", kelas: "XII RPL 1", guru: "Bu Rina", ruang: "R.301" },
    ],
  };

  const days = [
    { key: "senin", label: "Senin", data: schedule.senin },
    { key: "selasa", label: "Selasa", data: schedule.selasa },
    { key: "rabu", label: "Rabu", data: schedule.rabu },
    { key: "kamis", label: "Kamis", data: schedule.kamis },
    { key: "jumat", label: "Jumat", data: schedule.jumat },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-divider/50 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jadwal Pelajaran</h1>
          <p className="text-sm text-default-500">Jadwal kelas XII RPL 1 - Semester Genap 2024/2025</p>
        </div>
        <div className="flex items-center gap-4">
          <Button color="primary" startContent={<Plus size={20} />}>
            Tambah Jadwal
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
        {/* Jadwal Pelajaran */}
        <div>
          <h2 className="text-xl font-bold mb-4">Jadwal Pelajaran</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {days.map((day) => (
              <Card key={day.key} className="border border-divider/50 shadow-sm">
                <CardHeader className="bg-primary-50">
                  <h3 className="font-bold text-primary">{day.label}</h3>
                </CardHeader>
                <CardBody className="p-3 space-y-3">
                  {day.data.map((item) => (
                    <Card key={item.id} className="border border-divider/50 hover:shadow-md transition-shadow">
                      <CardBody className="p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm">{item.mapel}</h4>
                          <Chip size="sm" variant="flat" color="primary">
                            {item.kelas}
                          </Chip>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-default-500">
                            <Clock size={14} />
                            <span>{item.waktu}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-default-500">
                            <User size={14} />
                            <span>{item.guru}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-default-500">
                            <MapPin size={14} />
                            <span>{item.ruang}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Kartu Presensi */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Kartu Presensi</h2>
            <Button size="sm" variant="flat" startContent={<Plus size={18} />}>
              Tambah Kartu
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                id: 1,
                mapel: "Matematika",
                kelas: "XII RPL 1",
                guru: "Pak Budi",
                tanggal: "15 Jan 2025",
                totalSiswa: 36,
                hadir: 34,
                izin: 1,
                sakit: 0,
                alpha: 1,
                persentase: 94.4
              },
              {
                id: 2,
                mapel: "Pemrograman Web",
                kelas: "XII RPL 1",
                guru: "Pak Dedi",
                tanggal: "15 Jan 2025",
                totalSiswa: 36,
                hadir: 35,
                izin: 0,
                sakit: 1,
                alpha: 0,
                persentase: 97.2
              },
              {
                id: 3,
                mapel: "Basis Data",
                kelas: "XII RPL 1",
                guru: "Bu Sari",
                tanggal: "15 Jan 2025",
                totalSiswa: 36,
                hadir: 33,
                izin: 2,
                sakit: 0,
                alpha: 1,
                persentase: 91.7
              },
              {
                id: 4,
                mapel: "Bahasa Indonesia",
                kelas: "XII RPL 1",
                guru: "Bu Ani",
                tanggal: "15 Jan 2025",
                totalSiswa: 36,
                hadir: 36,
                izin: 0,
                sakit: 0,
                alpha: 0,
                persentase: 100
              },
            ].map((kartu) => (
              <Card key={kartu.id} className="border border-divider/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h3 className="font-bold text-lg">{kartu.mapel}</h3>
                      <p className="text-xs text-white/80">{kartu.kelas}</p>
                    </div>
                    <Chip size="sm" className="bg-white/20 text-white border-0">
                      {kartu.persentase}%
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-default-500">
                        <User size={16} />
                        <span>{kartu.guru}</span>
                      </div>
                      <div className="flex items-center gap-2 text-default-500">
                        <Clock size={16} />
                        <span>{kartu.tanggal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-default-400" />
                        <span className="text-sm text-default-500">Total Siswa</span>
                      </div>
                      <span className="font-semibold">{kartu.totalSiswa}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-success-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-success" weight="fill" />
                        <span className="text-sm text-success-700">Hadir</span>
                      </div>
                      <span className="font-bold text-success-700">{kartu.hadir}</span>
                    </div>

                    {(kartu.izin > 0 || kartu.sakit > 0) && (
                      <div className="flex items-center justify-between p-2 bg-warning-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ClockClockwise size={16} className="text-warning" weight="fill" />
                          <span className="text-sm text-warning-700">Izin/Sakit</span>
                        </div>
                        <span className="font-bold text-warning-700">{kartu.izin + kartu.sakit}</span>
                      </div>
                    )}

                    {kartu.alpha > 0 && (
                      <div className="flex items-center justify-between p-2 bg-danger-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <XCircle size={16} className="text-danger" weight="fill" />
                          <span className="text-sm text-danger-700">Alpha</span>
                        </div>
                        <span className="font-bold text-danger-700">{kartu.alpha}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-divider">
                    <div className="w-full bg-default-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          kartu.persentase >= 95 ? 'bg-success' :
                          kartu.persentase >= 90 ? 'bg-warning' : 'bg-danger'
                        }`}
                        style={{ width: `${kartu.persentase}%` }}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

