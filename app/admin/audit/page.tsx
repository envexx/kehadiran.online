"use client";

import { useState } from "react";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Skeleton } from "@heroui/skeleton";
import { Select, SelectItem } from "@heroui/select";
import { ClockCounterClockwise, PencilSimple, Plus, Trash, SignIn } from "phosphor-react";
import { useAdminAuditLogs } from "@/hooks/use-swr-hooks";

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const { data, isLoading } = useAdminAuditLogs({ action, entity, page, limit: 10 });

  const logs = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const actionIcon = (a: string) => {
    switch (a) {
      case "create": return <Plus size={12} weight="bold" className="text-emerald-400" />;
      case "update": return <PencilSimple size={12} weight="bold" className="text-blue-400" />;
      case "delete": return <Trash size={12} weight="bold" className="text-red-400" />;
      case "login": return <SignIn size={12} weight="bold" className="text-amber-400" />;
      default: return <ClockCounterClockwise size={12} className="text-gray-400" />;
    }
  };
  const actionColor = (a: string): "success" | "primary" | "danger" | "warning" | "default" => {
    switch (a) { case "create": return "success"; case "update": return "primary"; case "delete": return "danger"; case "login": return "warning"; default: return "default"; }
  };
  const fmtDate = (d: string) => new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
            <p className="text-xs text-gray-500">Riwayat aktivitas seluruh platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Select size="sm" placeholder="Filter action" className="w-[130px]" classNames={{ trigger: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 h-9 min-h-9", value: "text-gray-900 dark:text-gray-200 text-xs" }} onChange={(e) => { setAction(e.target.value === "all" ? "" : e.target.value); setPage(1); }}>
              <SelectItem key="all">Semua</SelectItem>
              <SelectItem key="create">Create</SelectItem>
              <SelectItem key="update">Update</SelectItem>
              <SelectItem key="delete">Delete</SelectItem>
              <SelectItem key="login">Login</SelectItem>
            </Select>
            <Select size="sm" placeholder="Filter entity" className="w-[130px]" classNames={{ trigger: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 h-9 min-h-9", value: "text-gray-900 dark:text-gray-200 text-xs" }} onChange={(e) => { setEntity(e.target.value === "all" ? "" : e.target.value); setPage(1); }}>
              <SelectItem key="all">Semua</SelectItem>
              <SelectItem key="user">User</SelectItem>
              <SelectItem key="tenant">Tenant</SelectItem>
              <SelectItem key="siswa">Siswa</SelectItem>
              <SelectItem key="presensi">Presensi</SelectItem>
              <SelectItem key="subscription">Subscription</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 sm:px-5 py-3.5 flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800" /><Skeleton className="h-3 w-64 rounded bg-gray-200 dark:bg-gray-800" /></div>
              </div>
            )) : logs.length > 0 ? logs.map((log: any) => (
              <div key={log.id} className="px-4 sm:px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {actionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{log.user}</span>
                    <Chip size="sm" color={actionColor(log.action)} variant="flat" className="text-[10px] capitalize">{log.action}</Chip>
                    <Chip size="sm" variant="flat" className="text-[10px] text-gray-400">{log.entity_type}</Chip>
                  </div>
                  {log.changes && <p className="text-xs text-gray-400 mt-1">{typeof log.changes === "object" ? JSON.stringify(log.changes) : log.changes}</p>}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-600">{fmtDate(log.created_at)}</span>
                    {log.ip_address && <span className="text-[10px] text-gray-600">IP: {log.ip_address}</span>}
                  </div>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-gray-600 text-sm">Belum ada audit log</div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">Menampilkan {logs.length} dari {total}</p>
            <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: "bg-blue-600" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
