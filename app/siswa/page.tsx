"use client";

import { useState, useEffect, useRef } from "react";
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
  Clock,
  FileXls,
  FileCsv,
  WarningCircle,
  Info
} from "phosphor-react";

export default function SiswaPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onOpenChange: onImportOpenChange } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterKelas, setFilterKelas] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; skipped: number; errors: string[] } | null>(null);

  // Form state
  const [fNama, setFNama] = useState("");
  const [fNisn, setFNisn] = useState("");
  const [fNis, setFNis] = useState("");
  const [fJk, setFJk] = useState("");
  const [fKelasId, setFKelasId] = useState("");
  const [fTempatLahir, setFTempatLahir] = useState("");
  const [fTglLahir, setFTglLahir] = useState("");
  const [fNamaAyah, setFNamaAyah] = useState("");
  const [fWaAyah, setFWaAyah] = useState("");
  const [fNamaIbu, setFNamaIbu] = useState("");
  const [fWaIbu, setFWaIbu] = useState("");

  // Kelas list for dropdown
  const [kelasList, setKelasList] = useState<{id:string;nama_kelas:string}[]>([]);
  useEffect(() => {
    fetch("/api/kelas").then(r => r.json()).then(d => { if (d.data) setKelasList(d.data); }).catch(() => {});
  }, []);

  const { data: siswaData, isLoading, mutate } = useSiswa({ search, page, limit: 20, kelasId: filterKelas || undefined });
  const { data: statsData, isLoading: statsLoading, mutate: mutateStats } = useSiswaStats();

  const resetForm = () => { setFNama(""); setFNisn(""); setFNis(""); setFJk(""); setFKelasId(""); setFTempatLahir(""); setFTglLahir(""); setFNamaAyah(""); setFWaAyah(""); setFNamaIbu(""); setFWaIbu(""); setFormError(""); };

  const handleSave = async (onClose: () => void) => {
    if (!fNama.trim() || !fNisn.trim() || !fJk || !fKelasId) { setFormError("Nama, NISN, jenis kelamin, dan kelas wajib diisi"); return; }
    setSaving(true); setFormError("");
    try {
      const res = await fetch("/api/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: fNama, nisn: fNisn, nis: fNis || null, jenis_kelamin: fJk, kelas_id: fKelasId,
          tempat_lahir: fTempatLahir || null, tanggal_lahir: fTglLahir || null,
          nama_ayah: fNamaAyah || null, nomor_wa_ayah: fWaAyah || null,
          nama_ibu: fNamaIbu || null, nomor_wa_ibu: fWaIbu || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error || "Gagal menyimpan"); setSaving(false); return; }
      mutate(); mutateStats(); resetForm(); onClose();
    } catch { setFormError("Terjadi kesalahan"); }
    setSaving(false);
  };

  const handleDownloadTemplate = () => {
    const header = "nisn,nis,nama_lengkap,jenis_kelamin,kelas_id,tempat_lahir,tanggal_lahir,nama_ayah,nomor_wa_ayah,nama_ibu,nomor_wa_ibu";
    const example = "0012345678,,Ahmad Rizki,L,<kelas_id>,Jakarta,2008-05-15,Budi Santoso,6281234567890,Siti Aminah,6281234567891";
    const notes = "# Petunjuk Pengisian:\n# nisn (wajib), nama_lengkap (wajib), jenis_kelamin: L/P (wajib), kelas_id (wajib - ambil dari halaman Kelas)\n# tanggal_lahir format: YYYY-MM-DD\n# nomor WA format: 628xxxxxxxxxx";
    const csv = notes + "\n" + header + "\n" + example;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template-import-siswa.csv";
    link.click();
  };

  const handleImportCSV = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim() && !l.startsWith("#"));
      if (lines.length < 2) { setImportResult({ created: 0, skipped: 0, errors: ["File kosong atau tidak valid"] }); setImporting(false); return; }
      const headers = lines[0].split(",").map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
        return obj;
      }).filter(r => r.nisn && r.nama_lengkap);

      const res = await fetch("/api/siswa/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: rows }),
      });
      const json = await res.json();
      if (res.ok) {
        setImportResult({ created: json.created, skipped: json.skipped, errors: json.errors || [] });
        mutate(); mutateStats();
      } else {
        setImportResult({ created: 0, skipped: 0, errors: [json.error || "Gagal import"] });
      }
    } catch {
      setImportResult({ created: 0, skipped: 0, errors: ["Terjadi kesalahan membaca file"] });
    }
    setImporting(false);
  };

  const handleExport = () => {
    window.open("/api/siswa/export", "_blank");
  };

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
                className="max-w-[180px]"
                selectedKeys={filterKelas ? [filterKelas] : []}
                onChange={(e) => { setFilterKelas(e.target.value); setPage(1); }}
                classNames={{
                  trigger: "bg-gray-50 border-0 shadow-none h-9 min-h-9",
                }}
              >
                {kelasList.map((k) => <SelectItem key={k.id}>{k.nama_kelas}</SelectItem>)}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<UploadSimple size={14} />} onPress={onImportOpen}>
                Import CSV
              </Button>
              <Button size="sm" variant="bordered" className="border-gray-200 text-gray-600" startContent={<Download size={14} />} onPress={handleExport}>
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
                {formError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-2">{formError}</div>}
                <div className="space-y-6">
                  {/* Data Siswa */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Data Siswa</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" size="sm" isRequired value={fNama} onValueChange={setFNama} />
                      <Input label="NISN" placeholder="Nomor Induk Siswa Nasional" size="sm" isRequired value={fNisn} onValueChange={setFNisn} />
                      <Input label="NIS" placeholder="Nomor Induk Siswa" size="sm" value={fNis} onValueChange={setFNis} />
                      <Select label="Jenis Kelamin" placeholder="Pilih" size="sm" isRequired selectedKeys={fJk ? [fJk] : []} onChange={(e) => setFJk(e.target.value)}>
                        <SelectItem key="L">Laki-laki</SelectItem>
                        <SelectItem key="P">Perempuan</SelectItem>
                      </Select>
                      <Select label="Kelas" placeholder="Pilih kelas" size="sm" isRequired selectedKeys={fKelasId ? [fKelasId] : []} onChange={(e) => setFKelasId(e.target.value)}>
                        {kelasList.map((k) => <SelectItem key={k.id}>{k.nama_kelas}</SelectItem>)}
                      </Select>
                      <Input label="Tempat Lahir" placeholder="Kota kelahiran" size="sm" value={fTempatLahir} onValueChange={setFTempatLahir} />
                      <Input label="Tanggal Lahir" type="date" size="sm" value={fTglLahir} onValueChange={setFTglLahir} />
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Data Orang Tua */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Data Orang Tua</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nama Ayah" placeholder="Nama lengkap ayah" size="sm" value={fNamaAyah} onValueChange={setFNamaAyah} />
                      <Input label="No. WhatsApp Ayah" placeholder="6281xxxxxxxxx" size="sm" value={fWaAyah} onValueChange={setFWaAyah} />
                      <Input label="Nama Ibu" placeholder="Nama lengkap ibu" size="sm" value={fNamaIbu} onValueChange={setFNamaIbu} />
                      <Input label="No. WhatsApp Ibu" placeholder="6281xxxxxxxxx" size="sm" value={fWaIbu} onValueChange={setFWaIbu} />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={() => { resetForm(); onClose(); }}>Batal</Button>
                <Button color="primary" className="bg-blue-600 font-medium" isLoading={saving} onPress={() => handleSave(onClose)}>Simpan Siswa</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Import CSV Modal */}
      <Modal isOpen={isImportOpen} onOpenChange={onImportOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Import Data Siswa</h3>
                  <p className="text-sm text-gray-500 font-normal">Upload file CSV untuk menambahkan siswa secara massal</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6 space-y-5">
                {/* Step 1: Download Template */}
                <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Langkah 1: Download Template</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Download template CSV terlebih dahulu, isi data siswa sesuai format, lalu upload kembali.
                        Kolom wajib: <strong>nisn, nama_lengkap, jenis_kelamin (L/P), kelas_id</strong>
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-blue-300 text-blue-700 bg-white"
                    startContent={<FileCsv size={16} />}
                    onPress={handleDownloadTemplate}
                  >
                    Download Template CSV
                  </Button>
                </div>

                {/* Step 2: Upload */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Langkah 2: Upload File CSV</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImportCSV(file);
                      e.target.value = "";
                    }}
                  />
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadSimple size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk pilih file CSV</p>
                    <p className="text-xs text-gray-400 mt-1">Maksimal 1000 baris per upload</p>
                  </div>
                </div>

                {/* Import Result */}
                {importing && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Mengimport data siswa...</p>
                  </div>
                )}
                {importResult && (
                  <div className={`rounded-xl p-4 space-y-2 ${importResult.created > 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-2">
                      {importResult.created > 0 ? (
                        <CheckCircle size={18} className="text-emerald-600" weight="fill" />
                      ) : (
                        <WarningCircle size={18} className="text-red-500" weight="fill" />
                      )}
                      <p className="text-sm font-semibold text-gray-900">
                        {importResult.created} siswa berhasil ditambahkan
                        {importResult.skipped > 0 && `, ${importResult.skipped} dilewati`}
                      </p>
                    </div>
                    {importResult.errors.length > 0 && (
                      <div className="space-y-1">
                        {importResult.errors.map((err, i) => (
                          <p key={i} className="text-xs text-red-600">• {err}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={() => { setImportResult(null); onClose(); }}>Tutup</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

