import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, tanggal, status_masuk] (HOT PATH)
  return NextResponse.json({
    totalSiswa: 1248,
    hadir: 1120,
    terlambat: 45,
    alpha: 15,
    izin: 40,
    sakit: 28,
    persentase: 94.5,
  });
}
