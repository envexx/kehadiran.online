import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tanggal = searchParams.get("tanggal") || new Date().toISOString().split("T")[0];
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, tanggal, status_masuk]
  const data = [
    { id: "p1", siswa_id: "1", nama: "Ahmad Rizki", kelas: "XII RPL 1", tanggal, waktu_masuk: "07:02", status_masuk: "hadir", metode_input: "qr_code" },
    { id: "p2", siswa_id: "2", nama: "Siti Nurhaliza", kelas: "XII RPL 1", tanggal, waktu_masuk: "07:05", status_masuk: "hadir", metode_input: "qr_code" },
    { id: "p3", siswa_id: "3", nama: "Budi Santoso", kelas: "XI TKJ 2", tanggal, waktu_masuk: "07:15", status_masuk: "terlambat", metode_input: "manual" },
    { id: "p4", siswa_id: "4", nama: "Dewi Lestari", kelas: "XII MM 1", tanggal, waktu_masuk: "07:01", status_masuk: "hadir", metode_input: "qr_code" },
    { id: "p5", siswa_id: "5", nama: "Eko Prasetyo", kelas: "X RPL 1", tanggal, waktu_masuk: "07:20", status_masuk: "terlambat", metode_input: "qr_code" },
    { id: "p6", siswa_id: "6", nama: "Fitri Handayani", kelas: "XI RPL 2", tanggal, waktu_masuk: "07:03", status_masuk: "hadir", metode_input: "qr_code" },
    { id: "p7", siswa_id: "7", nama: "Galih Pratama", kelas: "XII TKJ 1", tanggal, waktu_masuk: null, status_masuk: "alpha", metode_input: "manual" },
    { id: "p8", siswa_id: "8", nama: "Hana Safira", kelas: "X MM 1", tanggal, waktu_masuk: "07:08", status_masuk: "hadir", metode_input: "manual" },
  ];

  const total = data.length;
  const paged = data.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data: paged, total, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: { id: "new-presensi", ...body } }, { status: 201 });
}
