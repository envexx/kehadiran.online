import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const tahunAjaran = searchParams.get("tahunAjaran") || "";
    const semester = searchParams.get("semester") || "";

    const where: Record<string, unknown> = { tenant_id: tenantId };

    if (tahunAjaran) where.tahun_ajaran = tahunAjaran;
    if (semester) where.semester = semester;

    const data = await prisma.kelas.findMany({
      where,
      orderBy: [{ tingkat: "asc" }, { nama_kelas: "asc" }],
    });

    // Get wali kelas names
    const waliIds = data.map((k) => k.wali_kelas_id).filter(Boolean) as string[];
    const waliGuru = waliIds.length > 0
      ? await prisma.guru.findMany({ where: { id: { in: waliIds } }, select: { id: true, nama_guru: true } })
      : [];
    const waliMap = Object.fromEntries(waliGuru.map((g) => [g.id, g.nama_guru]));

    const mapped = data.map((k) => ({
      id: k.id,
      nama_kelas: k.nama_kelas,
      tingkat: k.tingkat,
      jurusan: k.jurusan,
      wali_kelas: k.wali_kelas_id ? waliMap[k.wali_kelas_id] || "—" : "—",
      wali_kelas_id: k.wali_kelas_id,
      tahun_ajaran: k.tahun_ajaran,
      semester: k.semester,
      kapasitas: k.kapasitas,
      jumlah_siswa: k.jumlah_siswa,
      is_active: k.is_active,
    }));

    return NextResponse.json({ data: mapped, total: mapped.length });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();
    const body = await request.json();

    const kelas = await prisma.kelas.create({
      data: {
        tenant_id: tenantId,
        nama_kelas: body.nama_kelas,
        tingkat: body.tingkat,
        jurusan: body.jurusan || null,
        wali_kelas_id: body.wali_kelas_id || null,
        tahun_ajaran: body.tahun_ajaran,
        semester: body.semester,
        kapasitas: body.kapasitas || 40,
      },
    });

    return NextResponse.json({ success: true, data: kelas }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
