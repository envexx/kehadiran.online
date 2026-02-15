"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { MagnifyingGlass, Buildings, Trash, Warning } from "phosphor-react";
import { useAdminTenants } from "@/hooks/use-swr-hooks";

export default function AdminTenantsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, mutate } = useAdminTenants({ search, page, limit: 10 });

  const tenants = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Delete modal state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nama: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const planColor = (plan: string): "default" | "primary" | "secondary" => {
    switch (plan) { case "starter": return "default"; case "pro": return "primary"; case "enterprise": return "secondary"; default: return "default"; }
  };
  const statusColor = (status: string): "success" | "warning" | "danger" | "default" => {
    switch (status) { case "active": return "success"; case "trial": return "warning"; case "expired": return "danger"; default: return "default"; }
  };

  const openDelete = (tenant: { id: string; nama: string }) => {
    setDeleteTarget(tenant);
    setDeleteError("");
    setConfirmText("");
    onOpen();
  };

  const handleDelete = async (onClose: () => void) => {
    if (!deleteTarget) return;
    if (confirmText !== deleteTarget.nama) {
      setDeleteError("Nama sekolah tidak cocok");
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/tenants/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        await mutate();
        onClose();
      } else {
        setDeleteError(json.error || "Gagal menghapus tenant");
      }
    } catch {
      setDeleteError("Terjadi kesalahan");
    }
    setDeleting(false);
  };

  const modalCls = { base: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800", header: "border-b border-gray-200 dark:border-gray-800", footer: "border-t border-gray-200 dark:border-gray-800" };

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Kelola Sekolah</h1>
            <p className="text-xs text-gray-500">Monitor semua tenant/sekolah yang terdaftar</p>
          </div>
          <Input size="sm" placeholder="Cari sekolah..." value={search} onValueChange={(v) => { setSearch(v); setPage(1); }} startContent={<MagnifyingGlass size={16} className="text-gray-500" />} classNames={{ inputWrapper: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-none h-9 min-h-9", input: "text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-500" }} className="w-[200px]" />
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <Table removeWrapper aria-label="Tabel sekolah" classNames={{ th: "bg-gray-50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider", td: "py-3 text-gray-600 dark:text-gray-300", tr: "hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/50" }}>
            <TableHeader>
              <TableColumn>Sekolah</TableColumn>
              <TableColumn className="hidden sm:table-cell">Plan</TableColumn>
              <TableColumn className="hidden md:table-cell">Siswa</TableColumn>
              <TableColumn className="hidden md:table-cell">Guru</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn className="w-[60px]">Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant: any) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0"><Buildings size={14} className="text-blue-400" weight="fill" /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tenant.nama}</p>
                        <p className="text-[10px] text-gray-500">{tenant.slug}.kehadiran.com</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><Chip size="sm" color={planColor(tenant.plan)} variant="flat" className="text-[10px] capitalize">{tenant.plan}</Chip></TableCell>
                  <TableCell className="hidden md:table-cell"><span className="text-sm text-gray-400">{tenant.siswa.toLocaleString()}</span></TableCell>
                  <TableCell className="hidden md:table-cell"><span className="text-sm text-gray-400">{tenant.guru}</span></TableCell>
                  <TableCell><Chip size="sm" color={statusColor(tenant.status)} variant="flat" className="text-[10px] capitalize">{tenant.status}</Chip></TableCell>
                  <TableCell>
                    <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-red-500" onPress={() => openDelete({ id: tenant.id, nama: tenant.nama })}>
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">Menampilkan {tenants.length} dari {total} sekolah</p>
            <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: "bg-blue-600" }} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={modalCls}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Warning size={20} className="text-red-500" weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Sekolah</h3>
                    <p className="text-xs text-gray-500 font-normal">Tindakan ini tidak dapat dibatalkan</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-3">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-1">Semua data berikut akan dihapus permanen:</p>
                  <ul className="text-xs text-red-600 dark:text-red-400/80 space-y-0.5 list-disc list-inside">
                    <li>Semua data siswa dan orang tua</li>
                    <li>Semua data guru dan user</li>
                    <li>Semua data presensi dan jadwal</li>
                    <li>Semua kelas, notifikasi, dan invoice</li>
                    <li>Subscription, API keys, dan pengaturan</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Ketik <strong className="text-gray-900 dark:text-white">{deleteTarget?.nama}</strong> untuk mengkonfirmasi:
                </p>
                <Input
                  placeholder="Ketik nama sekolah..."
                  size="sm"
                  value={confirmText}
                  onValueChange={setConfirmText}
                  classNames={{ inputWrapper: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700", input: "text-gray-900 dark:text-gray-200" }}
                />
                {deleteError && <p className="text-xs text-red-500 mt-2">{deleteError}</p>}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-gray-400">Batal</Button>
                <Button color="danger" isLoading={deleting} isDisabled={confirmText !== deleteTarget?.nama} onPress={() => handleDelete(onClose)}>Hapus Permanen</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
