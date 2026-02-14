"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Select, SelectItem } from "@heroui/select";
import { CheckCircle, XCircle, Clock, ArrowClockwise } from "phosphor-react";
import { useAdminEmailLogs } from "@/hooks/use-swr-hooks";

export default function AdminEmailLogsPage() {
  const [page, setPage] = useState(1);
  const [template, setTemplate] = useState("");
  const [status, setStatus] = useState("");
  const { data, isLoading } = useAdminEmailLogs({ template, status, page, limit: 10 });

  const logs = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const stats = data?.stats || { sent: 0, failed: 0, pending: 0 };

  const statusColor = (s: string): "success" | "warning" | "danger" | "default" => {
    switch (s) { case "sent": return "success"; case "pending": return "warning"; case "failed": return "danger"; default: return "default"; }
  };
  const templateLabel = (t: string) => {
    switch (t) { case "registration": return "Registrasi"; case "reset_password": return "Reset Password"; case "payment_success": return "Pembayaran"; case "invoice": return "Invoice"; default: return t; }
  };
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Email Logs</h1>
            <p className="text-xs text-gray-500">Riwayat semua email yang dikirim dari platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Select size="sm" placeholder="Filter template" className="w-[160px]" classNames={{ trigger: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 h-9 min-h-9", value: "text-gray-900 dark:text-gray-200 text-xs" }} onChange={(e) => { setTemplate(e.target.value === "all" ? "" : e.target.value); setPage(1); }}>
              <SelectItem key="all">Semua</SelectItem>
              <SelectItem key="registration">Registrasi</SelectItem>
              <SelectItem key="reset_password">Reset Password</SelectItem>
              <SelectItem key="payment_success">Pembayaran</SelectItem>
              <SelectItem key="invoice">Invoice</SelectItem>
            </Select>
            <Select size="sm" placeholder="Filter status" className="w-[130px]" classNames={{ trigger: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 h-9 min-h-9", value: "text-gray-900 dark:text-gray-200 text-xs" }} onChange={(e) => { setStatus(e.target.value === "all" ? "" : e.target.value); setPage(1); }}>
              <SelectItem key="all">Semua</SelectItem>
              <SelectItem key="sent">Sent</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="failed">Failed</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Terkirim", value: stats.sent, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Gagal", value: stats.failed, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}><Icon size={14} weight="fill" className={stat.color} /></div>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{isLoading ? "..." : stat.value.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <Table removeWrapper aria-label="Email logs" classNames={{ th: "bg-gray-50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider", td: "py-3 text-gray-600 dark:text-gray-300", tr: "hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/50" }}>
            <TableHeader>
              <TableColumn>Email</TableColumn>
              <TableColumn className="hidden sm:table-cell">Template</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn className="hidden md:table-cell">Waktu</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {logs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{log.to_email}</p>
                      <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{log.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Chip size="sm" variant="flat" className="text-[10px]">{templateLabel(log.template)}</Chip>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" color={statusColor(log.status)} variant="flat" className="text-[10px] capitalize">{log.status}</Chip>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-[10px] text-gray-500">{fmtDate(log.sent_at || log.created_at)}</span>
                  </TableCell>
                  <TableCell>
                    {log.status === "failed" && (
                      <Button isIconOnly size="sm" variant="light" className="text-gray-500 hover:text-blue-400" title="Retry"><ArrowClockwise size={14} /></Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">Menampilkan {logs.length} dari {total}</p>
            <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: "bg-blue-600" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
