import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, created_at] and [status, created_at]
  let data = [
    { id: "n1", siswa: "Ahmad Rizki", nomor_tujuan: "6281234567890", jenis: "presensi_hadir", status: "sent", pesan: "Ahmad Rizki telah hadir di sekolah pada 07:02", sent_at: "2025-02-14T07:05:00Z" },
    { id: "n2", siswa: "Budi Santoso", nomor_tujuan: "6281234567894", jenis: "presensi_terlambat", status: "sent", pesan: "Budi Santoso terlambat masuk sekolah pada 07:15", sent_at: "2025-02-14T07:18:00Z" },
    { id: "n3", siswa: "Galih Pratama", nomor_tujuan: "6281234567802", jenis: "presensi_alpha", status: "pending", pesan: "Galih Pratama tidak hadir di sekolah hari ini", sent_at: null },
    { id: "n4", siswa: "Siti Nurhaliza", nomor_tujuan: "6281234567892", jenis: "presensi_hadir", status: "sent", pesan: "Siti Nurhaliza telah hadir di sekolah pada 07:05", sent_at: "2025-02-14T07:08:00Z" },
    { id: "n5", siswa: "Eko Prasetyo", nomor_tujuan: "6281234567898", jenis: "presensi_terlambat", status: "failed", pesan: "Eko Prasetyo terlambat masuk sekolah pada 07:20", sent_at: null },
  ];

  if (status) {
    data = data.filter((n) => n.status === status);
  }

  const total = data.length;
  const paged = data.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data: paged, total, page, limit });
}
