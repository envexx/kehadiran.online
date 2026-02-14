import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    plan: "pro",
    status: "active",
    billing_cycle: "monthly",
    amount: 599000,
    currency: "IDR",
    started_at: "2025-01-01T00:00:00Z",
    ended_at: "2025-02-01T00:00:00Z",
    features: {
      max_siswa: 500,
      max_guru: 50,
      max_kelas: 20,
      wa_quota: 5000,
    },
  });
}
