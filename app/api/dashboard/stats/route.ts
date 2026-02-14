import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real Prisma queries
  const stats = {
    totalSiswa: 1248,
    siswaAktif: 1180,
    totalGuru: 86,
    totalKelas: 36,
    hadirHariIni: 1120,
    terlambatHariIni: 45,
    alphaHariIni: 15,
    izinHariIni: 68,
    persentaseKehadiran: 94.5,
    persentaseKemarin: 92.1,
    trendMingguan: [
      { hari: "Sen", hadir: 1150, alpha: 20, terlambat: 30 },
      { hari: "Sel", hadir: 1140, alpha: 25, terlambat: 35 },
      { hari: "Rab", hadir: 1160, alpha: 18, terlambat: 28 },
      { hari: "Kam", hadir: 1130, alpha: 30, terlambat: 40 },
      { hari: "Jum", hadir: 1120, alpha: 15, terlambat: 45 },
    ],
  };

  return NextResponse.json(stats);
}
