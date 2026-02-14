"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { TopBar } from "@/components/top-bar";
import { usePresensiStats } from "@/hooks/use-swr-hooks";
import { 
  MagnifyingGlass, 
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  PencilSimple,
  WifiHigh,
  WifiSlash,
  ArrowClockwise
} from "phosphor-react";

export default function PresensiPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState("qr");
  const [kelasList, setKelasList] = useState<{id:string;nama_kelas:string}[]>([]);
  const [manualKelas, setManualKelas] = useState("");
  const [manualStatus, setManualStatus] = useState("");
  const [manualSearch, setManualSearch] = useState("");
  const [manualKeterangan, setManualKeterangan] = useState("");
  const [manualSaving, setManualSaving] = useState(false);

  const { data: statsData } = usePresensiStats();
  const [recentScans, setRecentScans] = useState<{ id: string; nama: string; kelas: string; waktu: string; status: string }[]>([]);

  useEffect(() => {
    fetch("/api/kelas").then(r => r.json()).then(d => { if (d.data) setKelasList(d.data); }).catch(() => {});
    fetch("/api/presensi/recent?limit=20").then(r => r.json()).then(d => { if (d.data) setRecentScans(d.data); }).catch(() => {});
  }, []);

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

  const statusColor = (status: string) => {
    switch (status) {
      case "Hadir": return "success";
      case "Terlambat": return "warning";
      case "Alpha": return "danger";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Input Presensi" subtitle={`${currentDate} \u2022 ${currentTime}`} />

      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Scanner / Input */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <Tabs 
                aria-label="Metode Presensi" 
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                classNames={{
                  tabList: "bg-gray-50 p-1 mx-5 mt-5 rounded-xl",
                  tab: "h-9 rounded-lg text-sm",
                  cursor: "bg-white shadow-sm rounded-lg",
                  tabContent: "group-data-[selected=true]:text-blue-600 group-data-[selected=true]:font-semibold text-gray-500",
                }}
              >
                <Tab 
                  key="qr" 
                  title={
                    <div className="flex items-center gap-2">
                      <QrCode size={16} />
                      <span>QR Code</span>
                    </div>
                  }
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center">
                      {/* Scanner Area */}
                      <div className="relative w-full max-w-sm aspect-square bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                        {cameraActive ? (
                          <>
                            {/* Camera placeholder - in production, use html5-qrcode or react-qr-reader */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                            <div className="absolute inset-8 border-2 border-white/50 rounded-2xl" />
                            <div className="absolute top-8 left-8 w-8 h-8 border-t-3 border-l-3 border-blue-400 rounded-tl-lg" />
                            <div className="absolute top-8 right-8 w-8 h-8 border-t-3 border-r-3 border-blue-400 rounded-tr-lg" />
                            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-3 border-l-3 border-blue-400 rounded-bl-lg" />
                            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-3 border-r-3 border-blue-400 rounded-br-lg" />
                            {/* Scan line animation */}
                            <div className="absolute left-8 right-8 h-0.5 bg-blue-400 animate-pulse" style={{ top: '50%' }} />
                            <p className="text-white/60 text-sm mt-32">Arahkan QR Code ke kamera...</p>
                            <Button 
                              size="sm" 
                              className="absolute bottom-4 bg-white/20 backdrop-blur-sm text-white"
                              onPress={() => setCameraActive(false)}
                            >
                              Matikan Kamera
                            </Button>
                          </>
                        ) : (
                          <div className="text-center space-y-4 p-8">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
                              <QrCode size={40} className="text-white/60" />
                            </div>
                            <div>
                              <p className="text-white/80 font-medium">QR Code Scanner</p>
                              <p className="text-white/40 text-sm mt-1">Aktifkan kamera untuk mulai scan</p>
                            </div>
                            <Button 
                              color="primary" 
                              className="bg-blue-600 font-medium"
                              startContent={<Camera size={18} />}
                              onPress={() => setCameraActive(true)}
                            >
                              Aktifkan Kamera
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Scanner Info */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <WifiHigh size={14} className="text-emerald-500" />
                          <span>Online</span>
                        </div>
                        <div className="w-px h-3 bg-gray-200" />
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span>Mode: Gerbang Sekolah</span>
                        </div>
                        <div className="w-px h-3 bg-gray-200" />
                        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700">
                          <ArrowClockwise size={14} />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab>
                
                <Tab 
                  key="manual" 
                  title={
                    <div className="flex items-center gap-2">
                      <PencilSimple size={16} />
                      <span>Input Manual</span>
                    </div>
                  }
                >
                  <div className="p-6 space-y-5">
                    <Input
                      label="Cari Siswa"
                      placeholder="Ketik NIS atau nama siswa..."
                      size="lg"
                      startContent={<MagnifyingGlass size={18} className="text-gray-400" />}
                      classNames={{
                        inputWrapper: "bg-gray-50 border border-gray-200 shadow-none",
                      }}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Select label="Kelas" placeholder="Pilih kelas" size="lg" selectedKeys={manualKelas ? [manualKelas] : []} onChange={(e) => setManualKelas(e.target.value)} classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}>
                        {kelasList.map((k) => <SelectItem key={k.id}>{k.nama_kelas}</SelectItem>)}
                      </Select>
                      
                      <Select label="Status" placeholder="Pilih status" size="lg" selectedKeys={manualStatus ? [manualStatus] : []} onChange={(e) => setManualStatus(e.target.value)} classNames={{ trigger: "bg-gray-50 border border-gray-200 shadow-none" }}>
                        <SelectItem key="hadir">Hadir</SelectItem>
                        <SelectItem key="terlambat">Terlambat</SelectItem>
                        <SelectItem key="izin">Izin</SelectItem>
                        <SelectItem key="sakit">Sakit</SelectItem>
                        <SelectItem key="alpha">Alpha</SelectItem>
                      </Select>
                    </div>

                    <Input
                      label="Keterangan"
                      placeholder="Tambahkan keterangan jika diperlukan (opsional)"
                      size="lg"
                      value={manualKeterangan}
                      onValueChange={setManualKeterangan}
                      classNames={{
                        inputWrapper: "bg-gray-50 border border-gray-200 shadow-none",
                      }}
                    />

                    <Button color="primary" size="lg" className="w-full bg-blue-600 font-medium" isLoading={manualSaving}>
                      Simpan Presensi
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>

          {/* Right - Live Feed & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={16} className="text-emerald-600" weight="fill" />
                </div>
                <p className="text-xl font-bold text-gray-900">{statsData ? (statsData.hadir + statsData.terlambat).toLocaleString() : "—"}</p>
                <p className="text-[10px] text-gray-400">Hadir</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-2">
                  <Clock size={16} className="text-amber-600" weight="fill" />
                </div>
                <p className="text-xl font-bold text-gray-900">{statsData ? (statsData.izin + statsData.sakit).toLocaleString() : "—"}</p>
                <p className="text-[10px] text-gray-400">Izin/Sakit</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mx-auto mb-2">
                  <XCircle size={16} className="text-red-500" weight="fill" />
                </div>
                <p className="text-xl font-bold text-gray-900">{statsData ? statsData.alpha.toLocaleString() : "—"}</p>
                <p className="text-[10px] text-gray-400">Alpha</p>
              </div>
            </div>

            {/* Live Feed */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Scan Terbaru</h3>
                </div>
                <Chip size="sm" variant="flat" color="success" className="text-[10px]">
                  Live
                </Chip>
              </div>
              <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {recentScans.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-gray-400">Belum ada data presensi hari ini</p>
                  </div>
                ) : recentScans.map((scan) => (
                  <div key={scan.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                    <Avatar name={scan.nama} size="sm" className="w-9 h-9 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{scan.nama}</p>
                      <p className="text-xs text-gray-400">{scan.kelas}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Chip size="sm" color={statusColor(scan.status)} variant="flat" className="text-[10px]">
                        {scan.status}
                      </Chip>
                      <p className="text-[10px] text-gray-400 mt-1">{scan.waktu}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

