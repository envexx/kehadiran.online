"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { TopBar } from "@/components/top-bar";
import { DeleteModal } from "@/components/delete-modal";
import { useKelas, useKelasStats, useSettings } from "@/hooks/use-swr-hooks";
import Link from "next/link";
import { 
  Plus,
  Users,
  Student,
  ChalkboardTeacher,
  PencilSimple,
  Trash,
  QrCode
} from "phosphor-react";

interface KelasItem {
  id: string;
  nama_kelas: string;
  tingkat: string;
  jurusan: string;
  wali_kelas: string;
  tahun_ajaran: string;
  semester: string;
  kapasitas: number;
  jumlah_siswa: number;
  is_active: boolean;
}

export default function KelasPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [filterTA, setFilterTA] = useState("");
  const [editId, setEditId] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KelasItem | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Form state
  const [fNama, setFNama] = useState("");
  const [fTingkat, setFTingkat] = useState("");
  const [fJurusan, setFJurusan] = useState("");
  const [fKapasitas, setFKapasitas] = useState("40");
  const [fTahunAjaran, setFTahunAjaran] = useState("");
  const [fSemester, setFSemester] = useState("");
  const [fWaliKelasId, setFWaliKelasId] = useState("");

  // Guru list for wali kelas dropdown
  const [guruList, setGuruList] = useState<{id:string;nama_guru:string}[]>([]);
  useEffect(() => {
    fetch("/api/guru").then(r => r.json()).then(d => { if (d.data) setGuruList(d.data); }).catch(() => {});
  }, []);

  // Auto-populate tahun ajaran & semester from tenant settings
  const { data: settingsData } = useSettings();
  useEffect(() => {
    if (settingsData?.data) {
      const ta = settingsData.data.find((s: { key: string; value: string }) => s.key === "tahun_ajaran");
      const sm = settingsData.data.find((s: { key: string; value: string }) => s.key === "semester");
      if (ta && !fTahunAjaran) setFTahunAjaran(ta.value);
      if (sm && !fSemester) setFSemester(sm.value);
      if (ta && !filterTA) setFilterTA(ta.value);
    }
  }, [settingsData]);

  const { data: kelasData, isLoading, mutate } = useKelas({ tahunAjaran: filterTA || undefined });
  const { data: statsData, mutate: mutateStats } = useKelasStats();

  const resetForm = () => { setFNama(""); setFTingkat(""); setFJurusan(""); setFKapasitas("40"); setFTahunAjaran(""); setFSemester(""); setFWaliKelasId(""); setFormError(""); setEditId(""); };

  const openEdit = (kelas: KelasItem) => {
    setEditId(kelas.id);
    setFNama(kelas.nama_kelas);
    setFTingkat(kelas.tingkat);
    setFJurusan(kelas.jurusan || "");
    setFKapasitas(String(kelas.kapasitas));
    setFTahunAjaran(kelas.tahun_ajaran);
    setFSemester(kelas.semester);
    setFWaliKelasId("");
    setFormError("");
    onEditOpen();
  };

  const handleUpdate = async (onClose: () => void) => {
    if (!fNama.trim() || !fTingkat || !fTahunAjaran || !fSemester) { setFormError("Nama kelas, tingkat, tahun ajaran, dan semester wajib diisi"); return; }
    setSaving(true); setFormError("");
    try {
      const res = await fetch(`/api/kelas/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_kelas: fNama, tingkat: fTingkat, jurusan: fJurusan || null, kapasitas: parseInt(fKapasitas) || 40, tahun_ajaran: fTahunAjaran, semester: fSemester, wali_kelas_id: fWaliKelasId || null }),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error || "Gagal menyimpan"); setSaving(false); return; }
      mutate(); mutateStats(); resetForm(); onClose();
    } catch { setFormError("Terjadi kesalahan"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id); setDeleteError("");
    try {
      const res = await fetch(`/api/kelas/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) { setDeleteError(json.error || "Gagal menghapus"); setDeleting(null); return; }
      mutate(); mutateStats(); setDeleteTarget(null);
    } catch { setDeleteError("Terjadi kesalahan"); }
    setDeleting(null);
  };

  const handleSave = async (onClose: () => void) => {
    if (!fNama.trim() || !fTingkat || !fTahunAjaran || !fSemester) { setFormError("Nama kelas, tingkat, tahun ajaran, dan semester wajib diisi"); return; }
    setSaving(true); setFormError("");
    try {
      const res = await fetch("/api/kelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_kelas: fNama, tingkat: fTingkat, jurusan: fJurusan || null,
          kapasitas: parseInt(fKapasitas) || 40, tahun_ajaran: fTahunAjaran,
          semester: fSemester, wali_kelas_id: fWaliKelasId || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error || "Gagal menyimpan"); setSaving(false); return; }
      mutate(); mutateStats(); resetForm(); onClose();
    } catch { setFormError("Terjadi kesalahan"); }
    setSaving(false);
  };

  const classes: KelasItem[] = kelasData?.data || [];

  return (
    <div className="min-h-screen">
      <TopBar title="Manajemen Kelas" subtitle="Kelola kelas dan tahun ajaran" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={16} className="text-blue-600" weight="fill" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{statsData?.total ?? classes.length}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Total Kelas</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Student size={16} className="text-emerald-600" weight="fill" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{statsData?.totalSiswa?.toLocaleString() ?? "—"}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Total Siswa</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <ChalkboardTeacher size={16} className="text-amber-600" weight="fill" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{statsData?.rataRataPerKelas ?? "—"}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Rata-rata/Kelas</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              placeholder="Tahun Ajaran"
              size="sm"
              selectedKeys={filterTA ? [filterTA] : []}
              onChange={(e) => setFilterTA(e.target.value)}
              className="w-[160px]"
              classNames={{ trigger: "bg-white border border-gray-200 shadow-none h-9 min-h-9" }}
            >
              {(() => {
                const y = new Date().getFullYear();
                return [0, -1, -2, -3].map(offset => {
                  const val = `${y + offset}/${y + offset + 1}`;
                  return <SelectItem key={val}>{val}</SelectItem>;
                });
              })()}
            </Select>
            <Button size="sm" color="primary" className="bg-blue-600 font-medium" startContent={<Plus size={14} weight="bold" />} onPress={onOpen}>
              Tambah Kelas
            </Button>
          </div>
        </div>

        {/* Class Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <Skeleton className="w-24 h-5 rounded" />
                <Skeleton className="w-full h-3 rounded" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-3 rounded" />
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classes.map((kelas) => (
              <div key={kelas.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all group">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{kelas.nama_kelas}</h3>
                    <p className="text-xs text-gray-400">{kelas.tahun_ajaran} &middot; {kelas.semester}</p>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-amber-600" onPress={() => openEdit(kelas)}>
                      <PencilSimple size={14} />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-red-500" isLoading={deleting === kelas.id} onPress={() => { setDeleteError(""); setDeleteTarget(kelas); }}>
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>

                {/* Wali Kelas */}
                <div className="flex items-center gap-2.5 mb-4 p-2.5 bg-gray-50 rounded-xl">
                  <Avatar name={kelas.wali_kelas || "?"} size="sm" className="w-8 h-8" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{kelas.wali_kelas || "—"}</p>
                    <p className="text-[10px] text-gray-400">Wali Kelas</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Siswa</span>
                    <span className="text-xs font-semibold text-gray-700">{kelas.jumlah_siswa} / {kelas.kapasitas}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${(kelas.jumlah_siswa / kelas.kapasitas) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <Button
                    as={Link}
                    href={`/siswa?kelas=${kelas.nama_kelas}`}
                    size="sm"
                    variant="light"
                    className="flex-1 text-xs text-gray-600 hover:text-blue-600"
                    startContent={<Student size={14} />}
                  >
                    Lihat Siswa
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    className="text-xs text-gray-600 hover:text-blue-600"
                    startContent={<QrCode size={14} />}
                  >
                    QR Kelas
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tambah Kelas Baru</h3>
                  <p className="text-sm text-gray-500 font-normal">Lengkapi data kelas di bawah ini</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                {formError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-2">{formError}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Nama Kelas" placeholder="Contoh: XII RPL 1" size="sm" isRequired value={fNama} onValueChange={setFNama} />
                  <Select label="Tingkat" placeholder="Pilih tingkat" size="sm" isRequired selectedKeys={fTingkat ? [fTingkat] : []} onChange={(e) => setFTingkat(e.target.value)}>
                    <SelectItem key="1">Kelas 1</SelectItem>
                    <SelectItem key="2">Kelas 2</SelectItem>
                    <SelectItem key="3">Kelas 3</SelectItem>
                    <SelectItem key="4">Kelas 4</SelectItem>
                    <SelectItem key="5">Kelas 5</SelectItem>
                    <SelectItem key="6">Kelas 6</SelectItem>
                    <SelectItem key="7">Kelas 7</SelectItem>
                    <SelectItem key="8">Kelas 8</SelectItem>
                    <SelectItem key="9">Kelas 9</SelectItem>
                    <SelectItem key="10">Kelas 10</SelectItem>
                    <SelectItem key="11">Kelas 11</SelectItem>
                    <SelectItem key="12">Kelas 12</SelectItem>
                  </Select>
                  <Input label="Jurusan" placeholder="Contoh: RPL, TKJ" size="sm" value={fJurusan} onValueChange={setFJurusan} />
                  <Input label="Kapasitas" placeholder="40" type="number" size="sm" value={fKapasitas} onValueChange={setFKapasitas} />
                  <Select label="Tahun Ajaran" placeholder="Pilih" size="sm" isRequired selectedKeys={fTahunAjaran ? [fTahunAjaran] : []} onChange={(e) => setFTahunAjaran(e.target.value)}>
                    {(() => {
                      const y = new Date().getFullYear();
                      return [0, -1, -2, -3].map(offset => {
                        const val = `${y + offset}/${y + offset + 1}`;
                        return <SelectItem key={val}>{val}</SelectItem>;
                      });
                    })()}
                  </Select>
                  <Select label="Semester" placeholder="Pilih" size="sm" isRequired selectedKeys={fSemester ? [fSemester] : []} onChange={(e) => setFSemester(e.target.value)}>
                    <SelectItem key="ganjil">Ganjil</SelectItem>
                    <SelectItem key="genap">Genap</SelectItem>
                  </Select>
                  <Select label="Wali Kelas" placeholder="Pilih guru" size="sm" className="col-span-2" selectedKeys={fWaliKelasId ? [fWaliKelasId] : []} onChange={(e) => setFWaliKelasId(e.target.value)}>
                    {guruList.map((g) => <SelectItem key={g.id}>{g.nama_guru}</SelectItem>)}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={() => { resetForm(); onClose(); }}>Batal</Button>
                <Button color="primary" className="bg-blue-600 font-medium" isLoading={saving} onPress={() => handleSave(onClose)}>Simpan Kelas</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Class Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Edit Kelas</h3>
                  <p className="text-sm text-gray-500 font-normal">Ubah data kelas di bawah ini</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                {formError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-2">{formError}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Nama Kelas" placeholder="Contoh: XII RPL 1" size="sm" isRequired value={fNama} onValueChange={setFNama} />
                  <Select label="Tingkat" placeholder="Pilih tingkat" size="sm" isRequired selectedKeys={fTingkat ? [fTingkat] : []} onChange={(e) => setFTingkat(e.target.value)}>
                    {Array.from({ length: 12 }, (_, i) => <SelectItem key={String(i + 1)}>Kelas {i + 1}</SelectItem>)}
                  </Select>
                  <Input label="Jurusan" placeholder="Contoh: RPL, TKJ" size="sm" value={fJurusan} onValueChange={setFJurusan} />
                  <Input label="Kapasitas" placeholder="40" type="number" size="sm" value={fKapasitas} onValueChange={setFKapasitas} />
                  <Select label="Tahun Ajaran" placeholder="Pilih" size="sm" isRequired selectedKeys={fTahunAjaran ? [fTahunAjaran] : []} onChange={(e) => setFTahunAjaran(e.target.value)}>
                    {(() => { const y = new Date().getFullYear(); return [0, -1, -2, -3].map(offset => { const val = `${y + offset}/${y + offset + 1}`; return <SelectItem key={val}>{val}</SelectItem>; }); })()}
                  </Select>
                  <Select label="Semester" placeholder="Pilih" size="sm" isRequired selectedKeys={fSemester ? [fSemester] : []} onChange={(e) => setFSemester(e.target.value)}>
                    <SelectItem key="ganjil">Ganjil</SelectItem>
                    <SelectItem key="genap">Genap</SelectItem>
                  </Select>
                  <Select label="Wali Kelas" placeholder="Pilih guru" size="sm" className="col-span-2" selectedKeys={fWaliKelasId ? [fWaliKelasId] : []} onChange={(e) => setFWaliKelasId(e.target.value)}>
                    {guruList.map((g) => <SelectItem key={g.id}>{g.nama_guru}</SelectItem>)}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={() => { resetForm(); onClose(); }}>Batal</Button>
                <Button color="primary" className="bg-blue-600 font-medium" isLoading={saving} onPress={() => handleUpdate(onClose)}>Simpan Perubahan</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Kelas"
        description="Apakah Anda yakin ingin menghapus kelas ini? Semua data terkait kelas ini akan hilang dan tidak dapat dikembalikan."
        itemName={deleteTarget?.nama_kelas}
        isLoading={!!deleting}
        error={deleteError}
      />
    </div>
  );
}
