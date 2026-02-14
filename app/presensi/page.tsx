"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { TopBar } from "@/components/top-bar";
import { usePresensiStats } from "@/hooks/use-swr-hooks";
import { 
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  PencilSimple,
  WifiHigh,
  ArrowClockwise,
  SpeakerHigh
} from "phosphor-react";

interface ScanResult {
  type: "success" | "error" | "warning";
  nama?: string;
  kelas?: string;
  status?: string;
  waktu?: string;
  message?: string;
}

export default function PresensiPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState("qr");
  const [kelasList, setKelasList] = useState<{id:string;nama_kelas:string}[]>([]);
  const [manualKelas, setManualKelas] = useState("");
  const [manualStatus, setManualStatus] = useState("");
  const [manualSearch, setManualSearch] = useState("");
  const [manualKeterangan, setManualKeterangan] = useState("");
  const [manualSaving, setManualSaving] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [processing, setProcessing] = useState(false);

  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<unknown>(null);
  const lastScannedRef = useRef<string>("");
  const cooldownRef = useRef(false);

  const { data: statsData, mutate: mutateStats } = usePresensiStats();
  const [recentScans, setRecentScans] = useState<{ id: string; nama: string; kelas: string; waktu: string; status: string }[]>([]);

  const refreshRecent = useCallback(() => {
    fetch("/api/presensi/recent?limit=20").then(r => r.json()).then(d => { if (d.data) setRecentScans(d.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/kelas").then(r => r.json()).then(d => { if (d.data) setKelasList(d.data); }).catch(() => {});
    refreshRecent();
  }, [refreshRecent]);

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

  const handleQrScan = useCallback(async (decodedText: string) => {
    if (cooldownRef.current || processing) return;
    if (decodedText === lastScannedRef.current) return;

    cooldownRef.current = true;
    lastScannedRef.current = decodedText;
    setProcessing(true);
    setScanResult(null);

    try {
      // QR content: JSON { tenant_id, siswa_id } or plain siswa_id
      let siswaId = decodedText;
      let tenantId: string | undefined;
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed.siswa_id) siswaId = parsed.siswa_id;
        else if (parsed.id) siswaId = parsed.id;
        if (parsed.tenant_id) tenantId = parsed.tenant_id;
      } catch {
        // Not JSON, use raw text as siswa_id
      }

      const res = await fetch("/api/presensi/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siswa_id: siswaId, tenant_id: tenantId }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setScanResult({
          type: "success",
          nama: json.data.nama,
          kelas: json.data.kelas,
          status: json.data.status,
          waktu: json.data.waktu,
        });
        setScanCount(prev => prev + 1);
        mutateStats();
        refreshRecent();
      } else if (res.status === 409) {
        setScanResult({
          type: "warning",
          nama: json.nama,
          kelas: json.kelas,
          message: json.error,
        });
      } else {
        setScanResult({
          type: "error",
          message: json.error || "Gagal memproses QR Code",
        });
      }
    } catch {
      setScanResult({ type: "error", message: "Terjadi kesalahan jaringan" });
    }

    setProcessing(false);
    setTimeout(() => {
      cooldownRef.current = false;
      lastScannedRef.current = "";
    }, 3000);
  }, [processing, mutateStats, refreshRecent]);

  const stopScanner = useCallback(async () => {
    if (html5QrRef.current) {
      const scanner = html5QrRef.current as { stop: () => Promise<void>; clear: () => void; isScanning?: boolean; getState: () => number };
      html5QrRef.current = null;
      try {
        const state = scanner.getState();
        // state 2 = scanning, need to stop first
        if (state === 2) {
          await scanner.stop();
        }
        scanner.clear();
      } catch {
        try { scanner.clear(); } catch { /* ignore */ }
      }
    }
  }, []);

  // Start/stop QR scanner
  useEffect(() => {
    if (!cameraActive) {
      stopScanner();
      return;
    }

    // Start scanner
    let mounted = true;
    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted || !scannerRef.current) return;

        const scannerId = "qr-reader";
        let readerEl = document.getElementById(scannerId);
        if (!readerEl && scannerRef.current) {
          readerEl = document.createElement("div");
          readerEl.id = scannerId;
          scannerRef.current.appendChild(readerEl);
        }

        const scanner = new Html5Qrcode(scannerId);
        html5QrRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => { handleQrScan(decodedText); },
          () => {},
        );
      } catch (err) {
        console.error("QR Scanner error:", err);
        if (mounted) {
          setScanResult({ type: "error", message: "Gagal mengakses kamera. Pastikan izin kamera diberikan." });
          setCameraActive(false);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [cameraActive, handleQrScan, stopScanner]);

  const stopCamera = () => {
    setCameraActive(false);
    setScanResult(null);
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
                            <div ref={scannerRef} className="absolute inset-0 [&_video]:object-cover [&_video]:w-full [&_video]:h-full" />
                            <Button 
                              size="sm" 
                              className="absolute bottom-4 z-10 bg-white/20 backdrop-blur-sm text-white"
                              onPress={stopCamera}
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
                              onPress={() => { setScanResult(null); setCameraActive(true); }}
                            >
                              Aktifkan Kamera
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Scan Result Toast */}
                      {scanResult && (
                        <div className={`w-full max-w-sm mt-4 rounded-2xl p-4 ${
                          scanResult.type === "success" ? "bg-emerald-50 border border-emerald-200" :
                          scanResult.type === "warning" ? "bg-amber-50 border border-amber-200" :
                          "bg-red-50 border border-red-200"
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              scanResult.type === "success" ? "bg-emerald-100" :
                              scanResult.type === "warning" ? "bg-amber-100" : "bg-red-100"
                            }`}>
                              {scanResult.type === "success" ? <CheckCircle size={20} className="text-emerald-600" weight="fill" /> :
                               scanResult.type === "warning" ? <Clock size={20} className="text-amber-600" weight="fill" /> :
                               <XCircle size={20} className="text-red-500" weight="fill" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              {scanResult.nama && (
                                <p className="text-sm font-semibold text-gray-900">{scanResult.nama}</p>
                              )}
                              {scanResult.kelas && (
                                <p className="text-xs text-gray-500">{scanResult.kelas}</p>
                              )}
                              {scanResult.status && (
                                <Chip size="sm" color={statusColor(scanResult.status)} variant="flat" className="text-[10px] mt-1">
                                  {scanResult.status} {scanResult.waktu && `• ${scanResult.waktu}`}
                                </Chip>
                              )}
                              {scanResult.message && (
                                <p className={`text-xs mt-1 ${
                                  scanResult.type === "error" ? "text-red-600" : "text-amber-600"
                                }`}>{scanResult.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Scanner Info */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          {cameraActive ? (
                            <><WifiHigh size={14} className="text-emerald-500" /><span>Scanning</span></>
                          ) : (
                            <><WifiHigh size={14} className="text-gray-300" /><span>Offline</span></>
                          )}
                        </div>
                        <div className="w-px h-3 bg-gray-200" />
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <SpeakerHigh size={14} />
                          <span>Scan: {scanCount}</span>
                        </div>
                        {processing && (
                          <>
                            <div className="w-px h-3 bg-gray-200" />
                            <span className="text-xs text-blue-600 animate-pulse">Memproses...</span>
                          </>
                        )}
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
                      value={manualSearch}
                      onValueChange={setManualSearch}
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
                <div className="flex items-center gap-2">
                  <button onClick={refreshRecent} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <ArrowClockwise size={14} />
                  </button>
                  <Chip size="sm" variant="flat" color="success" className="text-[10px]">
                    Live
                  </Chip>
                </div>
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
