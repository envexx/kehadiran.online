import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// ============================================
// SWR Configuration defaults
// ============================================
const defaultConfig = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
};

const realtimeConfig = {
  ...defaultConfig,
  refreshInterval: 30000, // 30s for live data
  dedupingInterval: 10000,
};

const staticConfig = {
  ...defaultConfig,
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 min dedup for rarely changing data
};

// ============================================
// Current User / Auth
// ============================================
export function useCurrentUser() {
  return useSWR("/api/auth/me", fetcher, staticConfig);
}

// ============================================
// Dashboard
// ============================================
export function useDashboardStats(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/dashboard/stats?tenantId=${tenantId}` : `/api/dashboard/stats`,
    fetcher,
    realtimeConfig
  );
}

export function useRecentAttendance(tenantId?: string, limit = 10) {
  return useSWR(
    tenantId
      ? `/api/presensi/recent?tenantId=${tenantId}&limit=${limit}`
      : `/api/presensi/recent?limit=${limit}`,
    fetcher,
    realtimeConfig
  );
}

export function useWeeklyAttendance(tenantId?: string) {
  return useSWR(
    tenantId
      ? `/api/dashboard/weekly?tenantId=${tenantId}`
      : `/api/dashboard/weekly`,
    fetcher,
    defaultConfig
  );
}

// ============================================
// Siswa (Students)
// ============================================
export function useSiswa(params?: {
  tenantId?: string;
  kelasId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.tenantId) searchParams.set("tenantId", params.tenantId);
  if (params?.kelasId) searchParams.set("kelasId", params.kelasId);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return useSWR(`/api/siswa${query ? `?${query}` : ""}`, fetcher, defaultConfig);
}

export function useSiswaById(id?: string) {
  return useSWR(id ? `/api/siswa/${id}` : null, fetcher, defaultConfig);
}

export function useSiswaStats(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/siswa/stats?tenantId=${tenantId}` : `/api/siswa/stats`,
    fetcher,
    defaultConfig
  );
}

// ============================================
// Guru (Teachers)
// ============================================
export function useGuru(params?: {
  tenantId?: string;
  search?: string;
  isActive?: boolean;
}) {
  const searchParams = new URLSearchParams();
  if (params?.tenantId) searchParams.set("tenantId", params.tenantId);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));

  const query = searchParams.toString();
  return useSWR(`/api/guru${query ? `?${query}` : ""}`, fetcher, defaultConfig);
}

export function useGuruStats(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/guru/stats?tenantId=${tenantId}` : `/api/guru/stats`,
    fetcher,
    defaultConfig
  );
}

// ============================================
// Kelas (Classes)
// ============================================
export function useKelas(params?: {
  tenantId?: string;
  tahunAjaran?: string;
  semester?: string;
  isActive?: boolean;
}) {
  const searchParams = new URLSearchParams();
  if (params?.tenantId) searchParams.set("tenantId", params.tenantId);
  if (params?.tahunAjaran) searchParams.set("tahunAjaran", params.tahunAjaran);
  if (params?.semester) searchParams.set("semester", params.semester);
  if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));

  const query = searchParams.toString();
  return useSWR(`/api/kelas${query ? `?${query}` : ""}`, fetcher, defaultConfig);
}

export function useKelasStats(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/kelas/stats?tenantId=${tenantId}` : `/api/kelas/stats`,
    fetcher,
    defaultConfig
  );
}

// ============================================
// Presensi (Attendance)
// ============================================
export function usePresensi(params?: {
  tenantId?: string;
  tanggal?: string;
  kelasId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.tenantId) searchParams.set("tenantId", params.tenantId);
  if (params?.tanggal) searchParams.set("tanggal", params.tanggal);
  if (params?.kelasId) searchParams.set("kelasId", params.kelasId);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return useSWR(`/api/presensi${query ? `?${query}` : ""}`, fetcher, realtimeConfig);
}

export function usePresensiStats(tenantId?: string, tanggal?: string) {
  const searchParams = new URLSearchParams();
  if (tenantId) searchParams.set("tenantId", tenantId);
  if (tanggal) searchParams.set("tanggal", tanggal);

  const query = searchParams.toString();
  return useSWR(`/api/presensi/stats${query ? `?${query}` : ""}`, fetcher, realtimeConfig);
}

// ============================================
// Jadwal (Schedule)
// ============================================
export function useJadwal(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/jadwal?tenantId=${tenantId}` : `/api/jadwal`,
    fetcher,
    staticConfig
  );
}

// ============================================
// Laporan (Reports)
// ============================================
export function useLaporan(params?: {
  tenantId?: string;
  kelasId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.tenantId) searchParams.set("tenantId", params.tenantId);
  if (params?.kelasId) searchParams.set("kelasId", params.kelasId);
  if (params?.startDate) searchParams.set("startDate", params.startDate);
  if (params?.endDate) searchParams.set("endDate", params.endDate);

  const query = searchParams.toString();
  return useSWR(`/api/laporan${query ? `?${query}` : ""}`, fetcher, defaultConfig);
}

// ============================================
// Notifikasi (WhatsApp Notifications)
// ============================================
export function useNotifikasi(params?: {
  tenantId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.tenantId) searchParams.set("tenantId", params.tenantId);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return useSWR(`/api/notifikasi${query ? `?${query}` : ""}`, fetcher, defaultConfig);
}

export function useNotifikasiStats(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/notifikasi/stats?tenantId=${tenantId}` : `/api/notifikasi/stats`,
    fetcher,
    defaultConfig
  );
}

// ============================================
// Billing & Subscription
// ============================================
export function useSubscription(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/billing/subscription?tenantId=${tenantId}` : `/api/billing/subscription`,
    fetcher,
    staticConfig
  );
}

export function useInvoices(tenantId?: string) {
  return useSWR(
    tenantId ? `/api/billing/invoices?tenantId=${tenantId}` : `/api/billing/invoices`,
    fetcher,
    staticConfig
  );
}

// ============================================
// Settings
// ============================================
export function useSettings(tenantId?: string, category?: string) {
  const searchParams = new URLSearchParams();
  if (tenantId) searchParams.set("tenantId", tenantId);
  if (category) searchParams.set("category", category);

  const query = searchParams.toString();
  return useSWR(`/api/settings${query ? `?${query}` : ""}`, fetcher, staticConfig);
}

// ============================================
// Kartu Presensi (QR Cards)
// ============================================
export function useKartuPresensi(params?: {
  tenantId?: string;
  siswaId?: string;
  kelasId?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.tenantId) searchParams.set("tenantId", params.tenantId);
  if (params?.siswaId) searchParams.set("siswaId", params.siswaId);
  if (params?.kelasId) searchParams.set("kelasId", params.kelasId);

  const query = searchParams.toString();
  return useSWR(`/api/kartu-presensi${query ? `?${query}` : ""}`, fetcher, staticConfig);
}

// ============================================
// Super Admin Dashboard
// ============================================
export function useAdminOverview() {
  return useSWR("/api/admin/overview", fetcher, realtimeConfig);
}

export function useAdminTenants(params?: { search?: string; page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.search) sp.set("search", params.search);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return useSWR(`/api/admin/tenants${q ? `?${q}` : ""}`, fetcher, defaultConfig);
}

export function useAdminUsers(params?: { search?: string; page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.search) sp.set("search", params.search);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return useSWR(`/api/admin/users${q ? `?${q}` : ""}`, fetcher, defaultConfig);
}

export function useAdminSubscriptions(params?: { page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return useSWR(`/api/admin/subscriptions${q ? `?${q}` : ""}`, fetcher, defaultConfig);
}

export function useAdminInvoices(params?: { page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return useSWR(`/api/admin/invoices${q ? `?${q}` : ""}`, fetcher, defaultConfig);
}

export function useAdminEmailLogs(params?: { template?: string; status?: string; page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.template) sp.set("template", params.template);
  if (params?.status) sp.set("status", params.status);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return useSWR(`/api/admin/email-logs${q ? `?${q}` : ""}`, fetcher, defaultConfig);
}

export function useAdminAuditLogs(params?: { action?: string; entity?: string; page?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.action) sp.set("action", params.action);
  if (params?.entity) sp.set("entity", params.entity);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return useSWR(`/api/admin/audit-logs${q ? `?${q}` : ""}`, fetcher, defaultConfig);
}

export function useAdminSmtpConfigs() {
  return useSWR("/api/admin/smtp", fetcher, staticConfig);
}

export function useAdminEmailTemplates() {
  return useSWR("/api/admin/email-templates", fetcher, staticConfig);
}

// ============================================
// Mutation helpers (POST/PUT/DELETE)
// ============================================
export async function mutateAPI(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: Record<string, unknown>
) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }

  return res.json();
}
