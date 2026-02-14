import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real Prisma queries
  return NextResponse.json({
    rataRataKehadiran: 94.5,
    totalHadir: 22400,
    totalAlpha: 320,
    totalSakit: 580,
    totalIzin: 450,
    bulanan: [
      { bulan: "Jan", hadir: 95.2, alpha: 2.1, sakit: 1.5, izin: 1.2 },
      { bulan: "Feb", hadir: 93.8, alpha: 2.5, sakit: 2.0, izin: 1.7 },
      { bulan: "Mar", hadir: 94.1, alpha: 2.3, sakit: 1.8, izin: 1.8 },
      { bulan: "Apr", hadir: 95.0, alpha: 1.8, sakit: 1.5, izin: 1.7 },
      { bulan: "Mei", hadir: 94.5, alpha: 2.0, sakit: 1.7, izin: 1.8 },
    ],
    perKelas: [
      { kelas: "XII RPL 1", hadir: 96.2, siswa: 34 },
      { kelas: "XII RPL 2", hadir: 94.8, siswa: 33 },
      { kelas: "XI TKJ 2", hadir: 92.1, siswa: 32 },
      { kelas: "XII MM 1", hadir: 95.5, siswa: 35 },
      { kelas: "X RPL 1", hadir: 93.0, siswa: 30 },
    ],
  });
}
