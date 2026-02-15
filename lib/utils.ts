import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── WIB (UTC+7) Timezone Helpers ───────────────────────────────────
const WIB_OFFSET = 7 * 60; // minutes

/** Return a Date object whose UTC fields represent WIB wall-clock time. */
export function nowWIB(): Date {
  const utc = new Date();
  return new Date(utc.getTime() + WIB_OFFSET * 60_000);
}

/** Get today's start (00:00 WIB) as a real UTC Date for DB queries. */
export function todayStartWIB(): Date {
  const wib = nowWIB();
  // Build "YYYY-MM-DD 00:00:00 WIB" then convert back to UTC
  const y = wib.getUTCFullYear();
  const m = wib.getUTCMonth();
  const d = wib.getUTCDate();
  return new Date(Date.UTC(y, m, d) - WIB_OFFSET * 60_000);
}

/** Get tomorrow's start (00:00 WIB next day) as a real UTC Date. */
export function todayEndWIB(): Date {
  const start = todayStartWIB();
  return new Date(start.getTime() + 24 * 60 * 60_000);
}

/** Get the WIB day name (senin, selasa, …). */
export function dayNameWIB(): string {
  const dayNames = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
  const wib = nowWIB();
  return dayNames[wib.getUTCDay()];
}

/** Format a Date to "HH:mm" in WIB. */
export function formatTimeWIB(date: Date): string {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
}

/** Get current WIB hours and minutes as numbers. */
export function nowHoursMinutesWIB(): { hours: number; minutes: number } {
  const wib = nowWIB();
  return { hours: wib.getUTCHours(), minutes: wib.getUTCMinutes() };
}

/** Get today's date string in WIB as "YYYY-MM-DD". */
export function todayDateStringWIB(): string {
  const wib = nowWIB();
  const y = wib.getUTCFullYear();
  const m = String(wib.getUTCMonth() + 1).padStart(2, "0");
  const d = String(wib.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Convert a date-only string "YYYY-MM-DD" to start-of-day UTC (treating input as WIB). */
export function dateStringToStartWIB(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - WIB_OFFSET * 60_000);
}

/** Convert a date-only string "YYYY-MM-DD" to end-of-day UTC (treating input as WIB). */
export function dateStringToEndWIB(dateStr: string): Date {
  const start = dateStringToStartWIB(dateStr);
  return new Date(start.getTime() + 24 * 60 * 60_000);
}
