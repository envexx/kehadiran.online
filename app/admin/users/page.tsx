"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Pagination } from "@heroui/pagination";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { MagnifyingGlass, Buildings } from "phosphor-react";
import { useAdminUsers } from "@/hooks/use-swr-hooks";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ search, page, limit: 10 });

  const users = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const roleColor = (role: string): "danger" | "primary" | "default" => {
    switch (role) { case "superadmin": return "danger"; case "admin": return "primary"; default: return "default"; }
  };
  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Semua Users</h1>
            <p className="text-xs text-gray-500">Monitor user di seluruh tenant</p>
          </div>
          <Input size="sm" placeholder="Cari user..." value={search} onValueChange={(v) => { setSearch(v); setPage(1); }} startContent={<MagnifyingGlass size={16} className="text-gray-500" />} classNames={{ inputWrapper: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-none h-9 min-h-9", input: "text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-500" }} className="w-full sm:w-[250px]" />
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <Table removeWrapper aria-label="Tabel users" classNames={{ th: "bg-gray-50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider", td: "py-3 text-gray-600 dark:text-gray-300", tr: "hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/50" }}>
            <TableHeader>
              <TableColumn>User</TableColumn>
              <TableColumn className="hidden sm:table-cell">Tenant</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn className="hidden md:table-cell">Login Terakhir</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar name={user.nama} size="sm" className="w-7 h-7 sm:w-8 sm:h-8" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{user.nama}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {user.tenant ? (
                      <div className="flex items-center gap-1.5"><Buildings size={12} className="text-gray-500" /><span className="text-xs text-gray-400 truncate max-w-[150px]">{user.tenant}</span></div>
                    ) : (
                      <span className="text-xs text-gray-600">— Global</span>
                    )}
                  </TableCell>
                  <TableCell><Chip size="sm" color={roleColor(user.role)} variant="flat" className="text-[10px] capitalize">{user.role}</Chip></TableCell>
                  <TableCell className="hidden md:table-cell"><span className="text-xs text-gray-500">{formatDate(user.last_login)}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">Menampilkan {users.length} dari {total} users</p>
            <Pagination total={totalPages} page={page} onChange={setPage} size="sm" classNames={{ cursor: "bg-blue-600" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
