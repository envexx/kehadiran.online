import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    total: 36,
    aktif: 36,
    totalSiswa: 1248,
    rataRataPerKelas: 35,
  });
}
