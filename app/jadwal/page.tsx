"use client";

import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { TopBar } from "@/components/top-bar";
import { useJadwal } from "@/hooks/use-swr-hooks";
import { 
  Plus,
  Clock,
  PencilSimple,
  Trash
} from "phosphor-react";

export default function JadwalPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const jadwalHarian = [
    { hari: "Senin", jam_masuk: "07:00", jam_pulang: "15:00", active: true },
    { hari: "Selasa", jam_masuk: "07:00", jam_pulang: "15:00", active: true },
    { hari: "Rabu", jam_masuk: "07:00", jam_pulang: "15:00", active: true },
    { hari: "Kamis", jam_masuk: "07:00", jam_pulang: "15:00", active: true },
    { hari: "Jumat", jam_masuk: "07:00", jam_pulang: "11:30", active: true },
    { hari: "Sabtu", jam_masuk: "07:00", jam_pulang: "12:00", active: false },
    { hari: "Minggu", jam_masuk: "-", jam_pulang: "-", active: false },
  ];

  const dayColors: Record<string, string> = {
    Senin: "bg-blue-500",
    Selasa: "bg-emerald-500",
    Rabu: "bg-amber-500",
    Kamis: "bg-purple-500",
    Jumat: "bg-rose-500",
    Sabtu: "bg-gray-400",
    Minggu: "bg-gray-300",
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Jadwal Presensi" subtitle="Atur jam masuk dan pulang per hari" />

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select
              placeholder="Tahun Ajaran"
              size="sm"
              defaultSelectedKeys={["2024"]}
              className="w-[160px]"
              classNames={{ trigger: "bg-white border border-gray-200 shadow-none h-9 min-h-9" }}
            >
              <SelectItem key="2024">2024/2025</SelectItem>
              <SelectItem key="2023">2023/2024</SelectItem>
            </Select>
            <Select
              placeholder="Semester"
              size="sm"
              defaultSelectedKeys={["genap"]}
              className="w-[120px]"
              classNames={{ trigger: "bg-white border border-gray-200 shadow-none h-9 min-h-9" }}
            >
              <SelectItem key="ganjil">Ganjil</SelectItem>
              <SelectItem key="genap">Genap</SelectItem>
            </Select>
          </div>
          <Button size="sm" color="primary" className="bg-blue-600 font-medium" startContent={<Plus size={14} weight="bold" />} onPress={onOpen}>
            Edit Jadwal
          </Button>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jadwalHarian.map((jadwal) => (
            <div
              key={jadwal.hari}
              className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all ${
                jadwal.active ? "hover:border-blue-200 hover:shadow-sm" : "opacity-60"
              }`}
            >
              <div className={`h-1.5 ${dayColors[jadwal.hari]}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{jadwal.hari}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    jadwal.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {jadwal.active ? "Aktif" : "Libur"}
                  </span>
                </div>

                {jadwal.active ? (
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
                    <div className="flex gap-1 pt-1">
                      <Button size="sm" variant="light" className="flex-1 text-xs text-gray-500 hover:text-blue-600" startContent={<PencilSimple size={12} />}>
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-gray-400">Tidak ada jadwal</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-5">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">Catatan Jadwal Presensi</h4>
          <ul className="space-y-1.5 text-xs text-blue-700">
            <li>Siswa yang scan QR sebelum jam masuk akan otomatis tercatat sebagai <strong>Hadir</strong></li>
            <li>Siswa yang scan QR setelah jam masuk akan otomatis tercatat sebagai <strong>Terlambat</strong></li>
            <li>Siswa yang tidak scan QR sampai batas waktu akan otomatis tercatat sebagai <strong>Alpha</strong></li>
            <li>Batas waktu alpha otomatis: <strong>2 jam setelah jam masuk</strong></li>
          </ul>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Edit Jadwal Presensi</h3>
                  <p className="text-sm text-gray-500 font-normal">Atur jam masuk dan pulang per hari</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="space-y-4">
                  {jadwalHarian.filter(j => j.active).map((jadwal) => (
                    <div key={jadwal.hari} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 w-16">{jadwal.hari}</span>
                      <Input label="Jam Masuk" type="time" defaultValue={jadwal.jam_masuk} size="sm" className="flex-1" />
                      <Input label="Jam Pulang" type="time" defaultValue={jadwal.jam_pulang} size="sm" className="flex-1" />
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button variant="bordered" className="border-gray-200" onPress={onClose}>Batal</Button>
                <Button color="primary" className="bg-blue-600 font-medium" onPress={onClose}>Simpan Jadwal</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

