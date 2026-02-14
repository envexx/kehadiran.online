import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tahunAjaran = searchParams.get("tahunAjaran") || "";
  const semester = searchParams.get("semester") || "";

  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, tahun_ajaran, semester, is_active]
  let data = [
    { id: "k1", nama_kelas: "XII RPL 1", tingkat: "XII", jurusan: "RPL", wali_kelas: "Bambang Sutrisno", tahun_ajaran: "2024/2025", semester: "genap", kapasitas: 36, jumlah_siswa: 34, is_active: true },
    { id: "k2", nama_kelas: "XI TKJ 2", tingkat: "XI", jurusan: "TKJ", wali_kelas: "Agus Setiawan", tahun_ajaran: "2024/2025", semester: "genap", kapasitas: 36, jumlah_siswa: 32, is_active: true },
    { id: "k3", nama_kelas: "XII MM 1", tingkat: "XII", jurusan: "MM", wali_kelas: "Sari Indah", tahun_ajaran: "2024/2025", semester: "genap", kapasitas: 36, jumlah_siswa: 35, is_active: true },
    { id: "k4", nama_kelas: "X RPL 1", tingkat: "X", jurusan: "RPL", wali_kelas: "Rina Wulandari", tahun_ajaran: "2024/2025", semester: "genap", kapasitas: 36, jumlah_siswa: 30, is_active: true },
    { id: "k5", nama_kelas: "XI RPL 2", tingkat: "XI", jurusan: "RPL", wali_kelas: "Hendra Wijaya", tahun_ajaran: "2024/2025", semester: "genap", kapasitas: 36, jumlah_siswa: 33, is_active: true },
    { id: "k6", nama_kelas: "XII TKJ 1", tingkat: "XII", jurusan: "TKJ", wali_kelas: "Bambang Sutrisno", tahun_ajaran: "2024/2025", semester: "genap", kapasitas: 36, jumlah_siswa: 36, is_active: true },
  ];

  if (tahunAjaran) data = data.filter((k) => k.tahun_ajaran === tahunAjaran);
  if (semester) data = data.filter((k) => k.semester === semester);

  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: { id: "new-id", ...body } }, { status: 201 });
}
