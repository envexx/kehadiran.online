"use client";

import { useState } from "react";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Receipt } from "phosphor-react";
import { useAdminInvoices } from "@/hooks/use-swr-hooks";

export default function AdminInvoicesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminInvoices({ page, limit: 10 });

  const invoices = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const statusColor = (status: string): "success" | "warning" | "danger" | "default" => {
    switch (status) { case "paid": return "success"; case "sent": return "warning"; case "failed": return "danger"; default: return "default"; }
  };
  const fmtCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-xs text-gray-500">Riwayat invoice dan pembayaran</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <Table removeWrapper aria-label="Tabel invoices" classNames={{ th: "bg-gray-50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider", td: "py-3 text-gray-600 dark:text-gray-300", tr: "hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/50" }}>
            <TableHeader>
              <TableColumn>Invoice</TableColumn>
              <TableColumn className="hidden sm:table-cell">Sekolah</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn className="hidden md:table-cell">Jatuh Tempo</TableColumn>
            </TableHeader>
            <TableBody>
              {invoices.map((inv: any) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Receipt size={14} className="text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-mono font-medium text-gray-900 dark:text-white">{inv.invoice_number}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-gray-400 truncate max-w-[150px] block">{inv.tenant}</span>
                  </TableCell>
                  <TableCell><span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{fmtCurrency(inv.amount)}</span></TableCell>
                  <TableCell><Chip size="sm" color={statusColor(inv.status)} variant="flat" className="text-[10px] capitalize">{inv.status}</Chip></TableCell>
                  <TableCell className="hidden md:table-cell"><span className="text-xs text-gray-500">{fmtDate(inv.due_at)}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">Menampilkan {invoices.length} dari {total}</p>
            <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: "bg-blue-600" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
