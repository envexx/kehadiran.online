"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { Select, SelectItem } from "@heroui/select";
import { TopBar } from "@/components/top-bar";
import { useCurrentUser } from "@/hooks/use-swr-hooks";
import { 
  Download,
  MagnifyingGlass,
  QrCode,
  Printer,
  Fingerprint,
  FolderOpen,
  Export
} from "phosphor-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

interface StudentItem {
  id: string;
  nisn: string;
  nama_lengkap: string;
  kelas: string;
  kelas_id: string;
  foto: string | null;
}

interface KelasItem {
  id: string;
  nama_kelas: string;
}

export default function KartuPresensiPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const batchCardRef = useRef<HTMLDivElement>(null);
  const [searchNIS, setSearchNIS] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelasList, setKelasList] = useState<KelasItem[]>([]);
  const [filterKelas, setFilterKelas] = useState("");
  const [exporting, setExporting] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const tenantId = currentUser?.tenant?.id || "";

  useEffect(() => {
    fetch("/api/siswa?limit=500")
      .then(r => r.json())
      .then(d => { if (d.data) setStudents(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    fetch("/api/kelas")
      .then(r => r.json())
      .then(d => { if (d.data) setKelasList(d.data); })
      .catch(() => {});
  }, []);

  const filteredStudents = filterKelas
    ? students.filter(s => s.kelas_id === filterKelas)
    : students;

  const handleSearch = () => {
    const student = filteredStudents.find(s => s.nisn === searchNIS || s.nama_lengkap.toLowerCase().includes(searchNIS.toLowerCase()));
    if (student) setSelectedStudent(student);
  };

  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 4,
        backgroundColor: "#1e40af",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Kartu_Presensi_${selectedStudent?.nisn || 'student'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting PNG:", error);
    }
  };

  const handleExportAll = async () => {
    const target = filterKelas ? filteredStudents : students;
    if (target.length === 0) return;
    setExporting(true);
    try {
      for (const student of target) {
        // Create a temporary card element for each student
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.width = "800px";
        container.innerHTML = `
          <div style="background: linear-gradient(135deg, #1e40af, #1d4ed8, #2563eb); padding: 48px; border-radius: 24px; width: 800px; height: 340px; display: flex; flex-direction: column; justify-content: space-between; font-family: system-ui, sans-serif; color: white; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 22px; font-weight: 800; letter-spacing: 1px;">KARTU PRESENSI DIGITAL</div>
                <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">Kehadiran — Sistem Presensi QR Code</div>
              </div>
            </div>
            <div style="display: flex; gap: 40px; align-items: center; flex: 1; margin-top: 20px;">
              <div style="flex: 1;">
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px;">NISN</div>
                <div style="font-size: 28px; font-weight: 700;">${student.nisn}</div>
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px; margin-top: 12px;">Nama Lengkap</div>
                <div style="font-size: 22px; font-weight: 700;">${student.nama_lengkap}</div>
                <div style="display: flex; gap: 40px; margin-top: 12px;">
                  <div>
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px;">Kelas</div>
                    <div style="font-size: 18px; font-weight: 700;">${student.kelas || ""}</div>
                  </div>
                  <div>
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px;">Berlaku s/d</div>
                    <div style="font-size: 18px; font-weight: 700;">30/6/${new Date().getFullYear() + 1}</div>
                  </div>
                </div>
              </div>
              <div style="background: white; padding: 16px; border-radius: 16px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(JSON.stringify({tenant_id:'${tenantId}',siswa_id:'${student.id}'}))}" width="160" height="160" />
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(container);
        try {
          const dataUrl = await toPng(container.firstElementChild as HTMLElement, {
            quality: 1.0,
            pixelRatio: 3,
            cacheBust: true,
          });
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `Kartu_${student.nisn}_${student.nama_lengkap.replace(/\s+/g, '_')}.png`;
          link.click();
          // Small delay between downloads
          await new Promise(r => setTimeout(r, 300));
        } finally {
          document.body.removeChild(container);
        }
      }
    } catch (error) {
      console.error("Error batch exporting:", error);
    }
    setExporting(false);
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Kartu QR Presensi" subtitle="Cetak kartu presensi siswa dengan kualitas HD" />

      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Search */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">Cari Siswa</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="NISN atau Nama..."
                  value={searchNIS}
                  onChange={(e) => setSearchNIS(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  size="sm"
                  startContent={<MagnifyingGlass size={16} className="text-gray-400" />}
                  classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none h-9" }}
                />
                <Button size="sm" color="primary" className="bg-blue-600" onPress={handleSearch}>
                  Cari
                </Button>
              </div>
              <Select
                label="Filter Kelas"
                placeholder="Semua Kelas"
                size="sm"
                selectedKeys={filterKelas ? [filterKelas] : []}
                onChange={(e) => setFilterKelas(e.target.value)}
                classNames={{ trigger: "bg-gray-50 border-0 shadow-none" }}
              >
                {kelasList.map((k) => <SelectItem key={k.id}>{k.nama_kelas}</SelectItem>)}
              </Select>

              {selectedStudent && (
                <>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Avatar src={selectedStudent.foto || undefined} size="sm" className="w-10 h-10" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedStudent.nama_lengkap}</p>
                        <p className="text-xs text-gray-500">NISN: {selectedStudent.nisn} &middot; {selectedStudent.kelas}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      className="flex-1 bg-blue-600 font-medium"
                      startContent={<Download size={14} />}
                      onPress={handleExportPNG}
                    >
                      Export PNG HD
                    </Button>
                    <Button size="sm" variant="bordered" className="border-gray-200" startContent={<Printer size={14} />}>
                      Print
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Export Batch */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Export Kartu</h3>
              <p className="text-xs text-gray-400">
                {filterKelas
                  ? `Export ${filteredStudents.length} kartu untuk kelas yang dipilih`
                  : `Export semua ${students.length} kartu siswa`}
              </p>
              <Button
                size="sm"
                color="primary"
                className="w-full bg-blue-600 font-medium"
                startContent={!exporting && <Export size={14} />}
                isLoading={exporting}
                isDisabled={filteredStudents.length === 0}
                onPress={handleExportAll}
              >
                {exporting ? "Mengexport..." : filterKelas ? "Export Kelas Ini" : "Export Semua Kartu"}
              </Button>
              {filterKelas && (
                <Button
                  size="sm"
                  variant="bordered"
                  className="w-full border-gray-200 text-gray-600"
                  onPress={() => setFilterKelas("")}
                >
                  Reset Filter
                </Button>
              )}
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Daftar Siswa</h3>
                <span className="text-xs text-gray-400">{filteredStudents.length} siswa</span>
              </div>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                      selectedStudent?.id === student.id 
                        ? "bg-blue-50 border border-blue-200" 
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Avatar src={student.foto || undefined} size="sm" className="w-8 h-8" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.nama_lengkap}</p>
                      <p className="text-xs text-gray-400">{student.nisn} &middot; {student.kelas}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Card Preview */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="flex flex-col items-center">
                <div
                  ref={cardRef}
                  className="w-full max-w-2xl aspect-[85.6/53.98] rounded-2xl shadow-2xl p-8 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
                    minHeight: "400px"
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                          <Fingerprint size={32} weight="fill" className="text-blue-700" />
                        </div>
                      </div>
                      <div className="text-right">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                          KEHADIRAN
                        </h2>
                        <p className="text-lg text-white/80 font-medium">
                          Kartu Presensi Digital
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-6 items-center">
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">NISN</p>
                          <p className="text-white text-2xl font-bold">{selectedStudent.nisn}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Nama Lengkap</p>
                          <p className="text-white text-xl font-bold">{selectedStudent.nama_lengkap}</p>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Kelas</p>
                            <p className="text-white text-lg font-bold">{selectedStudent.kelas}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Berlaku s/d</p>
                            <p className="text-white text-lg font-bold">30/6/{new Date().getFullYear() + 1}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-white p-4 rounded-xl shadow-2xl">
                          <QRCodeSVG
                            value={JSON.stringify({ tenant_id: tenantId, siswa_id: selectedStudent.id })}
                            size={180}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400 text-center">
                  Klik &quot;Export PNG HD&quot; untuk mengunduh kartu dengan kualitas tinggi (4x retina)
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <QrCode size={32} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-500 mb-1">Belum ada siswa dipilih</p>
                <p className="text-sm text-gray-400 text-center max-w-sm">
                  Cari atau pilih siswa dari daftar untuk melihat preview kartu presensi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

