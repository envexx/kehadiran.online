"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { 
  MagnifyingGlass, 
  Bell,
  Plus,
  Download,
  Funnel,
  PencilSimple,
  Trash,
  Eye
} from "phosphor-react";

export default function SiswaPage() {
  const students = [
    {
      id: 1,
      nis: "2024001",
      nama: "Ahmad Rizki Maulana",
      kelas: "XII RPL 1",
      jenisKelamin: "L",
      email: "ahmad.rizki@email.com",
      telepon: "081234567890",
      foto: "https://i.pravatar.cc/150?u=student1",
      kehadiran: 95.2
    },
    {
      id: 2,
      nis: "2024002",
      nama: "Siti Nurhaliza",
      kelas: "XII RPL 1",
      jenisKelamin: "P",
      email: "siti.nur@email.com",
      telepon: "081234567891",
      foto: "https://i.pravatar.cc/150?u=student2",
      kehadiran: 98.5
    },
    {
      id: 3,
      nis: "2024003",
      nama: "Budi Santoso",
      kelas: "XII RPL 2",
      jenisKelamin: "L",
      email: "budi.santoso@email.com",
      telepon: "081234567892",
      foto: "https://i.pravatar.cc/150?u=student3",
      kehadiran: 92.8
    },
    {
      id: 4,
      nis: "2024004",
      nama: "Dewi Lestari",
      kelas: "XII RPL 1",
      jenisKelamin: "P",
      email: "dewi.lestari@email.com",
      telepon: "081234567893",
      foto: "https://i.pravatar.cc/150?u=student4",
      kehadiran: 96.3
    },
    {
      id: 5,
      nis: "2024005",
      nama: "Eko Prasetyo",
      kelas: "XII RPL 2",
      jenisKelamin: "L",
      email: "eko.prasetyo@email.com",
      telepon: "081234567894",
      foto: "https://i.pravatar.cc/150?u=student5",
      kehadiran: 89.7
    },
  ];

  const stats = [
    { label: "Total Siswa", value: "1,248", color: "primary" },
    { label: "Siswa Aktif", value: "1,205", color: "success" },
    { label: "Siswa Lulus", value: "38", color: "warning" },
    { label: "Siswa Pindah", value: "5", color: "danger" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-divider/50 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          <p className="text-sm text-default-500">Kelola data siswa dan informasi akademik</p>
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

      <div className="p-4 md:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-divider/50 shadow-sm">
              <CardBody className="p-5">
                <p className="text-sm text-default-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Main Table */}
        <Card className="border border-divider/50 shadow-sm">
          <CardHeader className="justify-between px-6 py-4">
            <h2 className="text-xl font-bold">Daftar Siswa</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Cari siswa..."
                size="sm"
                startContent={<MagnifyingGlass size={18} />}
                className="w-64"
              />
              <Button size="sm" variant="flat" startContent={<Funnel size={18} />}>
                Filter
              </Button>
              <Button size="sm" variant="flat" startContent={<Download size={18} />}>
                Export
              </Button>
              <Button size="sm" color="primary" startContent={<Plus size={18} />}>
                Tambah Siswa
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-0">
            <Table 
              removeWrapper
              aria-label="Tabel data siswa"
              classNames={{
                th: "bg-default-50",
              }}
            >
              <TableHeader>
                <TableColumn>SISWA</TableColumn>
                <TableColumn>NIS</TableColumn>
                <TableColumn>KELAS</TableColumn>
                <TableColumn>KONTAK</TableColumn>
                <TableColumn>KEHADIRAN</TableColumn>
                <TableColumn>AKSI</TableColumn>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar src={student.foto} size="md" />
                        <div>
                          <p className="font-semibold">{student.nama}</p>
                          <p className="text-xs text-default-400">
                            {student.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-default-500">{student.nis}</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat">{student.kelas}</Chip>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{student.email}</p>
                        <p className="text-xs text-default-400">{student.telepon}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-full bg-default-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                student.kehadiran >= 95 ? 'bg-success' :
                                student.kehadiran >= 90 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${student.kehadiran}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold">{student.kehadiran}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button isIconOnly size="sm" variant="light" color="primary">
                          <Eye size={18} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" color="warning">
                          <PencilSimple size={18} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" color="danger">
                          <Trash size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
          <CardFooter className="justify-center">
            <Pagination total={10} initialPage={1} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

