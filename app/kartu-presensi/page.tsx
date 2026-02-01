"use client";

import { useState, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { 
  Bell,
  Download,
  MagnifyingGlass,
  QrCode
} from "phosphor-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

export default function KartuPresensiPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [searchNIS, setSearchNIS] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Sample data - nanti akan diganti dengan data dari database
  const students = [
    {
      id: 1,
      nisn: "0012345678",
      nama: "Ahmad Rizki Maulana",
      kelas: "XII RPL 1",
      foto: "https://i.pravatar.cc/150?u=student1",
      berlaku: "30/6/2027"
    },
    {
      id: 2,
      nisn: "0012345679",
      nama: "Siti Nurhaliza",
      kelas: "XII RPL 1",
      foto: "https://i.pravatar.cc/150?u=student2",
      berlaku: "30/6/2027"
    },
    {
      id: 3,
      nisn: "0012345680",
      nama: "Budi Santoso",
      kelas: "XII RPL 2",
      foto: "https://i.pravatar.cc/150?u=student3",
      berlaku: "30/6/2027"
    },
  ];

  const handleSearch = () => {
    const student = students.find(s => s.nisn === searchNIS || s.nama.toLowerCase().includes(searchNIS.toLowerCase()));
    if (student) {
      setSelectedStudent(student);
    }
  };

  const handleExportPNG = async () => {
    if (!cardRef.current) return;

    try {
      // Export dengan kualitas HD menggunakan html-to-image
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 4, // 4x untuk HD quality (retina display)
        backgroundColor: "#1e40af", // Blue background
        cacheBust: true,
      });

      // Download image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Kartu_Presensi_${selectedStudent?.nisn || 'student'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting PNG:", error);
      alert("Gagal mengekspor kartu. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-divider/50 px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kartu Presensi</h1>
          <p className="text-sm text-default-500">Cetak kartu presensi siswa dengan kualitas HD</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button isIconOnly variant="light" className="rounded-full relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
          </Button>
          <div className="flex items-center gap-3 pl-4 border-l">
            <Avatar
              src="https://i.pravatar.cc/150?u=admin"
              size="md"
            />
            <div className="hidden md:block">
              <p className="text-sm font-semibold">Admin Sekolah</p>
              <p className="text-xs text-default-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Search & Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader>
                <h2 className="text-lg font-bold">Cari Siswa</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Cari NISN atau Nama..."
                    value={searchNIS}
                    onChange={(e) => setSearchNIS(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    size="lg"
                    startContent={<MagnifyingGlass size={20} />}
                  />
                </div>
                <Button 
                  color="primary" 
                  className="w-full"
                  onClick={handleSearch}
                >
                  Cari
                </Button>

                {selectedStudent && (
                  <div className="mt-4 p-4 bg-primary-50 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-primary-700">Siswa Ditemukan:</p>
                    <p className="font-bold">{selectedStudent.nama}</p>
                    <p className="text-sm text-default-600">NISN: {selectedStudent.nisn}</p>
                    <p className="text-sm text-default-600">Kelas: {selectedStudent.kelas}</p>
                  </div>
                )}

                {selectedStudent && (
                  <Button 
                    color="success" 
                    className="w-full"
                    startContent={<Download size={20} />}
                    onClick={handleExportPNG}
                    size="lg"
                  >
                    Export PNG HD
                  </Button>
                )}
              </CardBody>
            </Card>

            {/* Recent Students */}
            <Card className="border border-divider/50 shadow-sm">
              <CardHeader>
                <h3 className="font-bold">Siswa Terbaru</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-2 hover:bg-default-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Avatar src={student.foto} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.nama}</p>
                        <p className="text-xs text-default-400">{student.nisn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right - Card Preview */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="flex flex-col items-center">
                {/* Kartu Presensi - Design seperti kartu pelajar */}
                <div
                  ref={cardRef}
                  className="w-full max-w-2xl aspect-[85.6/53.98] bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
                    minHeight: "400px"
                  }}
                >
                  {/* Background Pattern (Optional) */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
                  </div>

                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Logo Tut Wuri Handayani */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg">
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                {/* Simplified Tut Wuri Handayani Logo */}
                                <circle cx="50" cy="50" r="45" fill="#1e40af" stroke="white" strokeWidth="2"/>
                                <path d="M50 20 L50 50 M50 50 L35 65 M50 50 L65 65" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
                                <circle cx="50" cy="30" r="5" fill="#f97316"/>
                              </svg>
                            </div>
                            <p className="text-[6px] text-blue-600 font-bold">TUT WURI</p>
                            <p className="text-[6px] text-blue-600 font-bold">HANDAYANI</p>
                          </div>
                        </div>
                      </div>

                      {/* School Name */}
                      <div className="text-right">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                          SMP ISLAM TERPADU
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 font-semibold">
                          Kartu Presensi
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 grid grid-cols-2 gap-6 items-center">
                      {/* Left - Student Info */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/80 text-sm mb-1">NISN</p>
                          <p className="text-white text-2xl font-bold">{selectedStudent.nisn}</p>
                        </div>

                        <div>
                          <p className="text-white/80 text-sm mb-1">Nama</p>
                          <p className="text-white text-xl font-bold">{selectedStudent.nama}</p>
                        </div>

                        <div className="flex gap-6">
                          <div>
                            <p className="text-white/80 text-sm mb-1">Kelas</p>
                            <p className="text-white text-xl font-bold">{selectedStudent.kelas}</p>
                          </div>
                          <div>
                            <p className="text-white/80 text-sm mb-1">Berlaku s/d</p>
                            <p className="text-white text-xl font-bold">{selectedStudent.berlaku}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right - QR Code */}
                      <div className="flex justify-end">
                        <div className="bg-white p-4 rounded-xl shadow-2xl">
                          <QRCodeSVG
                            value={`PRESENSI:${selectedStudent.nisn}:${selectedStudent.nama}`}
                            size={200}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-default-500 text-center">
                  Klik tombol "Export PNG HD" untuk mengunduh kartu dengan kualitas tinggi
                </p>
              </div>
            ) : (
              <Card className="border border-divider/50 shadow-sm">
                <CardBody className="flex flex-col items-center justify-center py-20">
                  <QrCode size={80} className="text-default-300 mb-4" />
                  <p className="text-lg font-semibold text-default-500 mb-2">
                    Belum ada siswa dipilih
                  </p>
                  <p className="text-sm text-default-400 text-center">
                    Cari siswa menggunakan NISN atau nama untuk melihat kartu presensi
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

