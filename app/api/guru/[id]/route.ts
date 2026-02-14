import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await requireTenantAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.guru.findFirst({ where: { id, tenant_id: tenantId } });
    if (!existing) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });

    const updated = await prisma.guru.update({
      where: { id },
      data: {
        nama_guru: body.nama_guru ?? existing.nama_guru,
        nip: body.nip !== undefined ? body.nip : existing.nip,
        email: body.email !== undefined ? body.email : existing.email,
        nomor_telepon: body.nomor_telepon !== undefined ? body.nomor_telepon : existing.nomor_telepon,
        nomor_wa: body.nomor_wa !== undefined ? body.nomor_wa : existing.nomor_wa,
        is_active: body.is_active !== undefined ? body.is_active : existing.is_active,
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

    const existing = await prisma.guru.findFirst({ where: { id, tenant_id: tenantId } });
    if (!existing) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });

    // Check if guru is wali kelas
    const kelasCount = await prisma.kelas.count({ where: { wali_kelas_id: id } });
    if (kelasCount > 0) {
      return NextResponse.json({ error: "Tidak dapat menghapus guru yang masih menjadi wali kelas" }, { status: 400 });
    }

    await prisma.guru.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
