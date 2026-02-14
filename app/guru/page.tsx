"use client";

import { useState } from "react";
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
import { useGuru, useGuruStats } from "@/hooks/use-swr-hooks";
import { 
  MagnifyingGlass, 
  Plus,
  Download,
  PencilSimple,
  Trash,
  Eye,
  ChalkboardTeacher,
  CheckCircle,
  XCircle,
  Phone
} from "phosphor-react";

export default function GuruPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [fNama, setFNama] = useState("");
  const [fNip, setFNip] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fTelp, setFTelp] = useState("");
  const [fWa, setFWa] = useState("");

  const { data: guruData, isLoading, mutate } = useGuru({ search });
  const { data: statsData, mutate: mutateStats } = useGuruStats();

  const resetForm = () => { setFNama(""); setFNip(""); setFEmail(""); setFTelp(""); setFWa(""); setFormError(""); };

  const handleSave = async (onClose: () => void) => {
    if (!fNama.trim()) { setFormError("Nama guru wajib diisi"); return; }
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/guru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_guru: fNama, nip: fNip || null, email: fEmail || null, nomor_telepon: fTelp || null, nomor_wa: fWa || null }),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error || "Gagal menyimpan"); setSaving(false); return; }
      mutate(); mutateStats(); resetForm(); onClose();
    } catch { setFormError("Terjadi kesalahan"); }
    setSaving(false);
  };

  const teachers = guruData?.data || [];

  const stats = [
    { label: "Total Guru", value: statsData ? statsData.total.toString() : "—", icon: ChalkboardTeacher, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Guru Aktif", value: statsData ? statsData.aktif.toString() : "—", icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Non-Aktif", value: statsData ? statsData.nonAktif.toString() : "—", icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Data Guru" subtitle="Kelola data guru dan wali kelas" />

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

        {/* Main Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
            <Input
              placeholder="Cari nama atau NIP..."
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
            <div className="flex gap-2">
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<Download size={14} />}>
                Export
              </Button>
              <Button size="sm" color="primary" className="bg-blue-600 font-medium" startContent={<Plus size={14} weight="bold" />} onPress={onOpen}>
                Tambah Guru
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-40 h-3 rounded" />
                    <Skeleton className="w-28 h-2 rounded" />
                  </div>
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <Table 
              removeWrapper
              aria-label="Tabel data guru"
              classNames={{
                th: "bg-gray-50/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>Guru</TableColumn>
                <TableColumn>NIP</TableColumn>
                <TableColumn>Kontak</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn width={100}>Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher: { id: string; nip: string; nama_guru: string; nomor_telepon: string; email: string; is_active: boolean }) => (
                  <TableRow key={teacher.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={teacher.nama_guru} size="sm" className="w-9 h-9" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{teacher.nama_guru}</p>
                          <p className="text-xs text-gray-400">{teacher.email || "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 font-mono">{teacher.nip || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone size={12} />
                        <span>{teacher.nomor_telepon || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        color={teacher.is_active ? "success" : "danger"}
                        className="text-xs"
                      >
                        {teacher.is_active ? "Aktif" : "Non-Aktif"}
                      </Chip>
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

          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50">
            <p className="text-xs text-gray-400">Menampilkan {teachers.length} dari {guruData?.total || 0} guru</p>
            <Pagination total={Math.ceil((guruData?.total || 0) / 20) || 1} initialPage={1} size="sm" />
          </div>
        </div>
      </div>

      {/* Add Teacher Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tambah Guru Baru</h3>
                  <p className="text-sm text-gray-500 font-normal">Lengkapi data guru di bawah ini</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                {formError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-2">{formError}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Nama Lengkap" placeholder="Nama lengkap guru" size="sm" isRequired className="col-span-2" value={fNama} onValueChange={setFNama} />
                  <Input label="NIP" placeholder="Nomor Induk Pegawai" size="sm" value={fNip} onValueChange={setFNip} />
                  <Input label="Email" placeholder="email@sekolah.sch.id" type="email" size="sm" value={fEmail} onValueChange={setFEmail} />
                  <Input label="Nomor Telepon" placeholder="08xxxxxxxxxx" size="sm" value={fTelp} onValueChange={setFTelp} />
                  <Input label="Nomor WhatsApp" placeholder="6281xxxxxxxxx" size="sm" value={fWa} onValueChange={setFWa} />
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={() => { resetForm(); onClose(); }}>Batal</Button>
                <Button color="primary" className="bg-blue-600 font-medium" isLoading={saving} onPress={() => handleSave(onClose)}>Simpan Guru</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
