"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { TopBar } from "@/components/top-bar";
import { 
  Clock,
  PencilSimple,
  FloppyDisk
} from "phosphor-react";

const ALL_DAYS = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
const DAY_LABELS: Record<string, string> = {
  senin: "Senin", selasa: "Selasa", rabu: "Rabu", kamis: "Kamis",
  jumat: "Jumat", sabtu: "Sabtu", minggu: "Minggu",
};
const DAY_COLORS: Record<string, string> = {
  senin: "bg-blue-500", selasa: "bg-emerald-500", rabu: "bg-amber-500",
  kamis: "bg-purple-500", jumat: "bg-rose-500", sabtu: "bg-cyan-500", minggu: "bg-gray-400",
};

interface JadwalItem {
  hari: string;
  jam_masuk: string;
  jam_pulang: string;
  is_active: boolean;
}

export default function JadwalPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [jadwalList, setJadwalList] = useState<JadwalItem[]>([]);
  const [editData, setEditData] = useState<JadwalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fetchJadwal = () => {
    setLoading(true);
    fetch("/api/jadwal")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const mapped = ALL_DAYS.map(hari => {
            const found = d.data.find((j: JadwalItem) => j.hari === hari);
            return found
              ? { hari: found.hari, jam_masuk: found.jam_masuk, jam_pulang: found.jam_pulang, is_active: found.is_active }
              : { hari, jam_masuk: "07:00", jam_pulang: "15:00", is_active: false };
          });
          setJadwalList(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJadwal(); }, []);

  const openEditModal = () => {
    setEditData(jadwalList.map(j => ({ ...j })));
    setSaveError("");
    onOpen();
  };

  const updateEditDay = (hari: string, field: keyof JadwalItem, value: string | boolean) => {
    setEditData(prev => prev.map(j => j.hari === hari ? { ...j, [field]: value } : j));
  };

  const handleSave = async (onClose: () => void) => {
    setSaving(true); setSaveError("");
    try {
      const res = await fetch("/api/jadwal/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: editData }),
      });
      const json = await res.json();
      if (!res.ok) { setSaveError(json.error || "Gagal menyimpan"); setSaving(false); return; }
      fetchJadwal();
      onClose();
    } catch { setSaveError("Terjadi kesalahan"); }
    setSaving(false);
  };

  const activeDays = jadwalList.filter(j => j.is_active).length;

  return (
    <div className="min-h-screen">
      <TopBar title="Jadwal Presensi" subtitle="Atur jam masuk dan pulang per hari" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock size={16} className="text-blue-600" weight="fill" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{activeDays}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Hari Aktif</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Clock size={16} className="text-gray-400" weight="fill" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{7 - activeDays}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Hari Libur</p>
              </div>
            </div>
          </div>
          <Button size="sm" color="primary" className="bg-blue-600 font-medium" startContent={<PencilSimple size={14} weight="bold" />} onPress={openEditModal}>
            Edit Jadwal
          </Button>
        </div>

        {/* Schedule Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jadwalList.map((jadwal) => (
              <div
                key={jadwal.hari}
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all ${
                  jadwal.is_active ? "hover:border-blue-200 hover:shadow-sm" : "opacity-60"
                }`}
              >
                <div className={`h-1.5 ${DAY_COLORS[jadwal.hari] || "bg-gray-300"}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">{DAY_LABELS[jadwal.hari] || jadwal.hari}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      jadwal.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {jadwal.is_active ? "Aktif" : "Libur"}
                    </span>
                  </div>

                  {jadwal.is_active ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Clock size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-500 font-medium">Jam Masuk</p>
                          <p className="text-lg font-bold text-blue-700">{jadwal.jam_masuk}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Clock size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-amber-500 font-medium">Jam Pulang</p>
                          <p className="text-lg font-bold text-amber-700">{jadwal.jam_pulang}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-gray-400">Hari libur</p>
                      <p className="text-xs text-gray-300 mt-1">Aktifkan di Edit Jadwal</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-5">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">Catatan Jadwal Presensi</h4>
          <ul className="space-y-1.5 text-xs text-blue-700">
            <li>Siswa yang scan QR sebelum jam masuk akan otomatis tercatat sebagai <strong>Hadir</strong></li>
            <li>Siswa yang scan QR setelah jam masuk akan otomatis tercatat sebagai <strong>Terlambat</strong></li>
            <li>Siswa yang tidak scan QR sampai batas waktu akan otomatis tercatat sebagai <strong>Alpha</strong></li>
            <li>Batas waktu alpha otomatis: <strong>2 jam setelah jam masuk</strong></li>
            <li>Aktifkan hari <strong>Sabtu</strong> atau <strong>Minggu</strong> jika sekolah masuk di hari tersebut</li>
          </ul>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Edit Jadwal Presensi</h3>
                  <p className="text-sm text-gray-500 font-normal">Atur jam masuk, jam pulang, dan aktifkan/nonaktifkan hari</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                {saveError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-4">{saveError}</div>}
                <div className="space-y-3">
                  {editData.map((jadwal) => (
                    <div key={jadwal.hari} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${jadwal.is_active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"}`}>
                      <div className="w-20 flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-900">{DAY_LABELS[jadwal.hari]}</p>
                      </div>
                      <Switch
                        size="sm"
                        isSelected={jadwal.is_active}
                        onValueChange={(val) => updateEditDay(jadwal.hari, "is_active", val)}
                        classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }}
                      />
                      {jadwal.is_active ? (
                        <>
                          <Input
                            label="Masuk"
                            type="time"
                            size="sm"
                            value={jadwal.jam_masuk}
                            onChange={(e) => updateEditDay(jadwal.hari, "jam_masuk", e.target.value)}
                            className="flex-1"
                            classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none" }}
                          />
                          <Input
                            label="Pulang"
                            type="time"
                            size="sm"
                            value={jadwal.jam_pulang}
                            onChange={(e) => updateEditDay(jadwal.hari, "jam_pulang", e.target.value)}
                            className="flex-1"
                            classNames={{ inputWrapper: "bg-gray-50 border-0 shadow-none" }}
                          />
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 flex-1 text-center">Libur</p>
                      )}
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={onClose}>Batal</Button>
                <Button color="primary" className="bg-blue-600 font-medium" startContent={!saving && <FloppyDisk size={16} />} isLoading={saving} onPress={() => handleSave(onClose)}>Simpan Jadwal</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
