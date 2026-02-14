import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const kelasId = searchParams.get("kelasId") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { tenant_id: tenantId };

    if (search) {
      where.OR = [
        { nama_lengkap: { contains: search, mode: "insensitive" } },
        { nisn: { contains: search } },
        { nis: { contains: search } },
      ];
    }

    if (kelasId) where.kelas_id = kelasId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.siswa.findMany({
        where,
        include: { kelas: { select: { nama_kelas: true } } },
        orderBy: { nama_lengkap: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.siswa.count({ where }),
    ]);

    const mapped = data.map((s) => ({
      id: s.id,
      nisn: s.nisn,
      nis: s.nis,
      nama_lengkap: s.nama_lengkap,
      jenis_kelamin: s.jenis_kelamin,
      kelas: s.kelas.nama_kelas,
      kelas_id: s.kelas_id,
      status: s.status,
      nomor_wa_ayah: s.nomor_wa_ayah,
      nomor_wa_ibu: s.nomor_wa_ibu,
      foto: s.foto,
    }));

    return NextResponse.json({ data: mapped, total, page, limit });
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

    const siswa = await prisma.siswa.create({
      data: {
        tenant_id: tenantId,
        nisn: body.nisn,
        nis: body.nis || null,
        nama_lengkap: body.nama_lengkap,
        jenis_kelamin: body.jenis_kelamin,
        tempat_lahir: body.tempat_lahir || null,
        tanggal_lahir: body.tanggal_lahir ? new Date(body.tanggal_lahir) : null,
        alamat: body.alamat || null,
        kelas_id: body.kelas_id,
        tahun_masuk: body.tahun_masuk || new Date().getFullYear(),
        status: "aktif",
        nama_ayah: body.nama_ayah || null,
        nomor_wa_ayah: body.nomor_wa_ayah || null,
        nama_ibu: body.nama_ibu || null,
        nomor_wa_ibu: body.nomor_wa_ibu || null,
      },
    });

    // Update jumlah_siswa on kelas
    await prisma.kelas.update({
      where: { id: body.kelas_id },
      data: { jumlah_siswa: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: siswa }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
