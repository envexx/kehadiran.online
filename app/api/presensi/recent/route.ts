import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  // TODO: Replace with real Prisma queries
  const recentAttendance = [
    { id: "1", nama: "Ahmad Rizki", kelas: "XII RPL 1", waktu: "07:02", status: "Hadir", metode: "QR Code" },
    { id: "2", nama: "Siti Nurhaliza", kelas: "XII RPL 1", waktu: "07:05", status: "Hadir", metode: "QR Code" },
    { id: "3", nama: "Budi Santoso", kelas: "XI TKJ 2", waktu: "07:15", status: "Terlambat", metode: "Manual" },
    { id: "4", nama: "Dewi Lestari", kelas: "XII MM 1", waktu: "07:01", status: "Hadir", metode: "QR Code" },
    { id: "5", nama: "Eko Prasetyo", kelas: "X RPL 1", waktu: "07:20", status: "Terlambat", metode: "QR Code" },
    { id: "6", nama: "Fitri Handayani", kelas: "XI RPL 2", waktu: "07:03", status: "Hadir", metode: "QR Code" },
    { id: "7", nama: "Galih Pratama", kelas: "XII TKJ 1", waktu: "07:00", status: "Hadir", metode: "QR Code" },
    { id: "8", nama: "Hana Safira", kelas: "X MM 1", waktu: "07:08", status: "Hadir", metode: "Manual" },
    { id: "9", nama: "Irfan Hakim", kelas: "XI RPL 1", waktu: "07:25", status: "Terlambat", metode: "QR Code" },
    { id: "10", nama: "Jasmine Putri", kelas: "XII RPL 2", waktu: "07:04", status: "Hadir", metode: "QR Code" },
  ].slice(0, limit);

  return NextResponse.json({ data: recentAttendance, total: 10 });
}
