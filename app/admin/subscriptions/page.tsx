"use client";

import { useState } from "react";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Skeleton } from "@heroui/skeleton";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Buildings } from "phosphor-react";
import { useAdminSubscriptions } from "@/hooks/use-swr-hooks";

export default function AdminSubscriptionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminSubscriptions({ page, limit: 10 });

  const subs = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const planStats = data?.planStats || [];

  const planColor = (plan: string): "default" | "primary" | "secondary" => {
    switch (plan) { case "starter": return "default"; case "pro": return "primary"; case "enterprise": return "secondary"; default: return "default"; }
  };
  const statusColor = (status: string): "success" | "warning" | "danger" | "default" => {
    switch (status) { case "active": return "success"; case "trial": return "warning"; case "expired": return "danger"; default: return "default"; }
  };
  const fmtCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const planColorMap: Record<string, string> = { starter: "bg-gray-500/10 text-gray-400", pro: "bg-blue-500/10 text-blue-400", enterprise: "bg-purple-500/10 text-purple-400", free: "bg-gray-500/10 text-gray-400" };

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-xs text-gray-500">Monitor subscription semua sekolah</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {isLoading ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
              <Skeleton className="h-6 w-16 rounded-lg bg-gray-200 dark:bg-gray-800 mb-3" />
              <Skeleton className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          )) : planStats.map((stat: any, i: number) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-block mb-3 capitalize ${planColorMap[stat.plan] || planColorMap.free}`}>{stat.plan}</div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.count} <span className="text-sm font-normal text-gray-500">sekolah</span></p>
              <p className="text-xs text-gray-500 mt-1">Revenue: {fmtCurrency(stat.revenue)}/bulan</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <Table removeWrapper aria-label="Tabel subscriptions" classNames={{ th: "bg-gray-50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider", td: "py-3 text-gray-600 dark:text-gray-300", tr: "hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/50" }}>
            <TableHeader>
              <TableColumn>Sekolah</TableColumn>
              <TableColumn>Plan</TableColumn>
              <TableColumn className="hidden sm:table-cell">Cycle</TableColumn>
              <TableColumn className="hidden md:table-cell">Amount</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn className="hidden md:table-cell">Berakhir</TableColumn>
            </TableHeader>
            <TableBody>
              {subs.map((sub: any) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Buildings size={14} className="text-blue-400 flex-shrink-0" weight="fill" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{sub.tenant}</span>
                    </div>
                  </TableCell>
                  <TableCell><Chip size="sm" color={planColor(sub.plan)} variant="flat" className="text-[10px] capitalize">{sub.plan}</Chip></TableCell>
                  <TableCell className="hidden sm:table-cell"><span className="text-xs text-gray-400 capitalize">{sub.billing_cycle}</span></TableCell>
                  <TableCell className="hidden md:table-cell"><span className="text-xs font-medium text-gray-900 dark:text-white">{fmtCurrency(sub.amount)}</span></TableCell>
                  <TableCell><Chip size="sm" color={statusColor(sub.status)} variant="flat" className="text-[10px] capitalize">{sub.status}</Chip></TableCell>
                  <TableCell className="hidden md:table-cell"><span className="text-xs text-gray-500">{fmtDate(sub.ended_at)}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">Menampilkan {subs.length} dari {total}</p>
            <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: "bg-blue-600" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
