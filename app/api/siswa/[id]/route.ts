import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await requireTenantAuth();
    const { id } = await params;

    const siswa = await prisma.siswa.findFirst({
      where: { id, tenant_id: tenantId },
      include: { kelas: { select: { nama_kelas: true } } },
    });
    if (!siswa) return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });

    return NextResponse.json({
      id: siswa.id,
      nisn: siswa.nisn,
      nis: siswa.nis,
      nama_lengkap: siswa.nama_lengkap,
      jenis_kelamin: siswa.jenis_kelamin,
      kelas_id: siswa.kelas_id,
      kelas: siswa.kelas.nama_kelas,
      tempat_lahir: siswa.tempat_lahir,
      tanggal_lahir: siswa.tanggal_lahir ? siswa.tanggal_lahir.toISOString().split("T")[0] : null,
      alamat: siswa.alamat,
      status: siswa.status,
      nama_ayah: siswa.nama_ayah,
      nomor_wa_ayah: siswa.nomor_wa_ayah,
      nama_ibu: siswa.nama_ibu,
      nomor_wa_ibu: siswa.nomor_wa_ibu,
      foto: siswa.foto,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await requireTenantAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.siswa.findFirst({ where: { id, tenant_id: tenantId } });
    if (!existing) return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });

    const oldKelasId = existing.kelas_id;
    const newKelasId = body.kelas_id ?? oldKelasId;

    const updated = await prisma.siswa.update({
      where: { id },
      data: {
        nama_lengkap: body.nama_lengkap ?? existing.nama_lengkap,
        nisn: body.nisn ?? existing.nisn,
        nis: body.nis !== undefined ? body.nis : existing.nis,
        jenis_kelamin: body.jenis_kelamin ?? existing.jenis_kelamin,
        kelas_id: newKelasId,
        tempat_lahir: body.tempat_lahir !== undefined ? body.tempat_lahir : existing.tempat_lahir,
        tanggal_lahir: body.tanggal_lahir ? new Date(body.tanggal_lahir) : existing.tanggal_lahir,
        nama_ayah: body.nama_ayah !== undefined ? body.nama_ayah : existing.nama_ayah,
        nomor_wa_ayah: body.nomor_wa_ayah !== undefined ? body.nomor_wa_ayah : existing.nomor_wa_ayah,
        nama_ibu: body.nama_ibu !== undefined ? body.nama_ibu : existing.nama_ibu,
        nomor_wa_ibu: body.nomor_wa_ibu !== undefined ? body.nomor_wa_ibu : existing.nomor_wa_ibu,
        status: body.status ?? existing.status,
      },
    });

    // Update jumlah_siswa if kelas changed
    if (oldKelasId !== newKelasId) {
      await prisma.kelas.update({ where: { id: oldKelasId }, data: { jumlah_siswa: { decrement: 1 } } });
      await prisma.kelas.update({ where: { id: newKelasId }, data: { jumlah_siswa: { increment: 1 } } });
    }

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

    const existing = await prisma.siswa.findFirst({ where: { id, tenant_id: tenantId } });
    if (!existing) return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });

    await prisma.siswa.delete({ where: { id } });

    // Decrement jumlah_siswa on kelas
    await prisma.kelas.update({ where: { id: existing.kelas_id }, data: { jumlah_siswa: { decrement: 1 } } });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
