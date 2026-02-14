"use client";

import { useState, useCallback } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { TopBar } from "@/components/top-bar";
import { useSiswa, useSiswaStats } from "@/hooks/use-swr-hooks";
import { 
  MagnifyingGlass, 
  Plus,
  Download,
  PencilSimple,
  Trash,
  Eye,
  UploadSimple,
  Student,
  CheckCircle,
  XCircle,
  Clock
} from "phosphor-react";

export default function SiswaPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: siswaData, isLoading } = useSiswa({ search, page, limit: 20 });
  const { data: statsData, isLoading: statsLoading } = useSiswaStats();

  const students = siswaData?.data || [];
  const totalPages = Math.ceil((siswaData?.total || 0) / 20);

  const stats = [
    { label: "Total Siswa", value: statsData ? statsData.total.toLocaleString() : "—", icon: Student, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Siswa Aktif", value: statsData ? statsData.aktif.toLocaleString() : "—", icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Lulus", value: statsData ? statsData.lulus.toLocaleString() : "—", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Tidak Aktif", value: statsData ? (statsData.pindah + statsData.keluar).toLocaleString() : "—", icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Data Siswa" subtitle="Kelola data siswa dan informasi akademik" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Main Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
            <div className="flex items-center gap-3 flex-1">
              <Input
                placeholder="Cari nama atau NIS..."
                size="sm"
                value={search}
                onValueChange={setSearch}
                startContent={<MagnifyingGlass size={16} className="text-gray-400" />}
                classNames={{
                  inputWrapper: "bg-gray-50 border-0 shadow-none h-9",
                  input: "text-sm",
                }}
                className="max-w-xs"
              />
              <Select
                placeholder="Semua Kelas"
                size="sm"
                className="max-w-[150px]"
                classNames={{
                  trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9",
                }}
              >
                <SelectItem key="12rpl1">XII RPL 1</SelectItem>
                <SelectItem key="12rpl2">XII RPL 2</SelectItem>
                <SelectItem key="11rpl1">XI RPL 1</SelectItem>
                <SelectItem key="11rpl2">XI RPL 2</SelectItem>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<UploadSimple size={14} />}>
                Import CSV
              </Button>
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<Download size={14} />}>
                Export
              </Button>
              <Button size="sm" color="primary" className="bg-blue-600 font-medium" startContent={<Plus size={14} weight="bold" />} onPress={onOpen}>
                Tambah Siswa
              </Button>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-40 h-3 rounded" />
                    <Skeleton className="w-24 h-2 rounded" />
                  </div>
                  <Skeleton className="w-20 h-3 rounded" />
                  <Skeleton className="w-16 h-3 rounded" />
                  <Skeleton className="w-20 h-4 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <Table 
              removeWrapper
              aria-label="Tabel data siswa"
              classNames={{
                th: "bg-gray-50/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>Siswa</TableColumn>
                <TableColumn>NIS / NISN</TableColumn>
                <TableColumn>Kelas</TableColumn>
                <TableColumn>Orang Tua</TableColumn>
                <TableColumn>Kehadiran</TableColumn>
                <TableColumn width={100}>Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {students.map((student: { id: string; nis: string; nisn: string; nama_lengkap: string; jenis_kelamin: string; kelas: string; nomor_wa_ayah: string; nomor_wa_ibu: string; persentase_kehadiran: number }) => (
                  <TableRow key={student.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={student.nama_lengkap} size="sm" className="w-9 h-9" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.nama_lengkap}</p>
                          <p className="text-xs text-gray-400">
                            {student.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-700">{student.nis}</p>
                        <p className="text-xs text-gray-400">{student.nisn}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{student.kelas}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs text-gray-400">{student.nomor_wa_ayah || student.nomor_wa_ibu || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px]">
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                student.persentase_kehadiran >= 95 ? 'bg-emerald-500' :
                                student.persentase_kehadiran >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${student.persentase_kehadiran}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-xs font-semibold ${
                          student.persentase_kehadiran >= 95 ? 'text-emerald-600' :
                          student.persentase_kehadiran >= 90 ? 'text-blue-600' : 'text-amber-600'
                        }`}>{student.persentase_kehadiran}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-blue-600">
                          <Eye size={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-amber-600">
                          <PencilSimple size={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-red-500">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50">
            <p className="text-xs text-gray-400">Menampilkan {students.length} dari {siswaData?.total || 0} siswa</p>
            <Pagination total={totalPages || 1} page={page} onChange={setPage} size="sm" />
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tambah Siswa Baru</h3>
                  <p className="text-sm text-gray-500 font-normal">Lengkapi data siswa di bawah ini</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="space-y-6">
                  {/* Data Siswa */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Data Siswa</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" size="sm" isRequired />
                      <Input label="Nama Panggilan" placeholder="Nama panggilan" size="sm" />
                      <Input label="NISN" placeholder="Nomor Induk Siswa Nasional" size="sm" isRequired />
                      <Input label="NIS" placeholder="Nomor Induk Siswa" size="sm" />
                      <Select label="Jenis Kelamin" placeholder="Pilih" size="sm" isRequired>
                        <SelectItem key="L">Laki-laki</SelectItem>
                        <SelectItem key="P">Perempuan</SelectItem>
                      </Select>
                      <Select label="Kelas" placeholder="Pilih kelas" size="sm" isRequired>
                        <SelectItem key="12rpl1">XII RPL 1</SelectItem>
                        <SelectItem key="12rpl2">XII RPL 2</SelectItem>
                        <SelectItem key="11rpl1">XI RPL 1</SelectItem>
                        <SelectItem key="11rpl2">XI RPL 2</SelectItem>
                      </Select>
                      <Input label="Tempat Lahir" placeholder="Kota kelahiran" size="sm" />
                      <Input label="Tanggal Lahir" type="date" size="sm" />
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Data Orang Tua */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Data Orang Tua</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nama Ayah" placeholder="Nama lengkap ayah" size="sm" />
                      <Input label="No. WhatsApp Ayah" placeholder="6281xxxxxxxxx" size="sm" />
                      <Input label="Nama Ibu" placeholder="Nama lengkap ibu" size="sm" />
                      <Input label="No. WhatsApp Ibu" placeholder="6281xxxxxxxxx" size="sm" />
                      <Select label="Preferensi Notifikasi" placeholder="Kirim notif ke" size="sm" className="col-span-2">
                        <SelectItem key="ayah">Ayah</SelectItem>
                        <SelectItem key="ibu">Ibu</SelectItem>
                        <SelectItem key="keduanya">Keduanya</SelectItem>
                      </Select>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" className="bg-blue-600 font-medium" onPress={onClose}>
                  Simpan Siswa
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

