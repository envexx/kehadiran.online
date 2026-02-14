import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await requireTenantAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.kelas.findFirst({ where: { id, tenant_id: tenantId } });
    if (!existing) return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });

    const updated = await prisma.kelas.update({
      where: { id },
      data: {
        nama_kelas: body.nama_kelas ?? existing.nama_kelas,
        tingkat: body.tingkat ?? existing.tingkat,
        jurusan: body.jurusan !== undefined ? body.jurusan : existing.jurusan,
        wali_kelas_id: body.wali_kelas_id !== undefined ? body.wali_kelas_id : existing.wali_kelas_id,
        tahun_ajaran: body.tahun_ajaran ?? existing.tahun_ajaran,
        semester: body.semester ?? existing.semester,
        kapasitas: body.kapasitas ?? existing.kapasitas,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await requireTenantAuth();
    const { id } = await params;

    const existing = await prisma.kelas.findFirst({ where: { id, tenant_id: tenantId } });
    if (!existing) return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });

    if (existing.jumlah_siswa > 0) {
      return NextResponse.json({ error: "Tidak dapat menghapus kelas yang masih memiliki siswa" }, { status: 400 });
    }

    await prisma.kelas.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
