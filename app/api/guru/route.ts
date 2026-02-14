import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, is_active]
  let data = [
    { id: "1", nip: "198501012010011001", nama_guru: "Dr. Hendra Wijaya, M.Pd", nomor_telepon: "081234567890", nomor_wa: "6281234567890", email: "hendra@sekolah.sch.id", is_active: true, mata_pelajaran: "Matematika" },
    { id: "2", nip: "198602022011012002", nama_guru: "Sari Indah, S.Pd", nomor_telepon: "081234567891", nomor_wa: "6281234567891", email: "sari@sekolah.sch.id", is_active: true, mata_pelajaran: "Bahasa Indonesia" },
    { id: "3", nip: "198703032012013003", nama_guru: "Bambang Sutrisno, S.Kom", nomor_telepon: "081234567892", nomor_wa: "6281234567892", email: "bambang@sekolah.sch.id", is_active: true, mata_pelajaran: "Pemrograman" },
    { id: "4", nip: "198804042013014004", nama_guru: "Rina Wulandari, S.Pd", nomor_telepon: "081234567893", nomor_wa: "6281234567893", email: "rina@sekolah.sch.id", is_active: true, mata_pelajaran: "Bahasa Inggris" },
    { id: "5", nip: "198905052014015005", nama_guru: "Agus Setiawan, M.T", nomor_telepon: "081234567894", nomor_wa: "6281234567894", email: "agus@sekolah.sch.id", is_active: false, mata_pelajaran: "Jaringan Komputer" },
  ];

  if (search) {
    data = data.filter((g) => g.nama_guru.toLowerCase().includes(search.toLowerCase()) || (g.nip && g.nip.includes(search)));
  }

  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: { id: "new-id", ...body } }, { status: 201 });
}
