import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const kelasId = searchParams.get("kelasId") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // TODO: Replace with real Prisma queries using optimized indexes
  // Uses index: [tenant_id, kelas_id, status] and [tenant_id, nama_lengkap]
  let data = [
    { id: "1", nisn: "0012345678", nis: "12001", nama_lengkap: "Ahmad Rizki", jenis_kelamin: "L", kelas: "XII RPL 1", kelas_id: "k1", status: "aktif", nomor_wa_ayah: "6281234567890", nomor_wa_ibu: "6281234567891", persentase_kehadiran: 96 },
    { id: "2", nisn: "0012345679", nis: "12002", nama_lengkap: "Siti Nurhaliza", jenis_kelamin: "P", kelas: "XII RPL 1", kelas_id: "k1", status: "aktif", nomor_wa_ayah: "6281234567892", nomor_wa_ibu: "6281234567893", persentase_kehadiran: 98 },
    { id: "3", nisn: "0012345680", nis: "12003", nama_lengkap: "Budi Santoso", jenis_kelamin: "L", kelas: "XI TKJ 2", kelas_id: "k2", status: "aktif", nomor_wa_ayah: "6281234567894", nomor_wa_ibu: "6281234567895", persentase_kehadiran: 88 },
    { id: "4", nisn: "0012345681", nis: "12004", nama_lengkap: "Dewi Lestari", jenis_kelamin: "P", kelas: "XII MM 1", kelas_id: "k3", status: "aktif", nomor_wa_ayah: "6281234567896", nomor_wa_ibu: "6281234567897", persentase_kehadiran: 94 },
    { id: "5", nisn: "0012345682", nis: "12005", nama_lengkap: "Eko Prasetyo", jenis_kelamin: "L", kelas: "X RPL 1", kelas_id: "k4", status: "aktif", nomor_wa_ayah: "6281234567898", nomor_wa_ibu: "6281234567899", persentase_kehadiran: 91 },
    { id: "6", nisn: "0012345683", nis: "12006", nama_lengkap: "Fitri Handayani", jenis_kelamin: "P", kelas: "XI RPL 2", kelas_id: "k5", status: "aktif", nomor_wa_ayah: "6281234567800", nomor_wa_ibu: "6281234567801", persentase_kehadiran: 97 },
    { id: "7", nisn: "0012345684", nis: "12007", nama_lengkap: "Galih Pratama", jenis_kelamin: "L", kelas: "XII TKJ 1", kelas_id: "k6", status: "lulus", nomor_wa_ayah: "6281234567802", nomor_wa_ibu: "6281234567803", persentase_kehadiran: 85 },
    { id: "8", nisn: "0012345685", nis: "12008", nama_lengkap: "Hana Safira", jenis_kelamin: "P", kelas: "X MM 1", kelas_id: "k7", status: "aktif", nomor_wa_ayah: "6281234567804", nomor_wa_ibu: "6281234567805", persentase_kehadiran: 99 },
  ];

  if (search) {
    data = data.filter((s) => s.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search));
  }
  if (kelasId) {
    data = data.filter((s) => s.kelas_id === kelasId);
  }
  if (status) {
    data = data.filter((s) => s.status === status);
  }

  const total = data.length;
  const paged = data.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data: paged, total, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: Replace with real Prisma create
  return NextResponse.json({ success: true, data: { id: "new-id", ...body } }, { status: 201 });
}
