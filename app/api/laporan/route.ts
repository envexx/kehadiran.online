import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const kelasId = searchParams.get("kelasId");

    // Build date filter
    const dateFilter: Record<string, unknown> = {};
    if (startDate) {
      const sd = new Date(startDate);
      sd.setHours(0, 0, 0, 0);
      dateFilter.gte = sd;
    }
    if (endDate) {
      const ed = new Date(endDate);
      ed.setHours(23, 59, 59, 999);
      dateFilter.lt = new Date(ed.getTime() + 1);
    }

    const presensiWhere: Record<string, unknown> = { tenant_id: tenantId };
    if (Object.keys(dateFilter).length > 0) presensiWhere.tanggal = dateFilter;

    // Overall stats
    const allPresensi = await prisma.presensi.groupBy({
      by: ["status_masuk"],
      where: presensiWhere,
      _count: true,
    });

    const totalHadir = (allPresensi.find((p) => p.status_masuk === "hadir")?._count || 0) +
      (allPresensi.find((p) => p.status_masuk === "terlambat")?._count || 0);
    const totalAlpha = allPresensi.find((p) => p.status_masuk === "alpha")?._count || 0;
    const totalIzin = allPresensi.find((p) => p.status_masuk === "izin")?._count || 0;
    const totalSakit = allPresensi.find((p) => p.status_masuk === "sakit")?._count || 0;
    const grandTotal = allPresensi.reduce((sum, p) => sum + p._count, 0);
    const rataRataKehadiran = grandTotal > 0 ? Math.round((totalHadir / grandTotal) * 1000) / 10 : 0;

    // Per kelas stats
    const kelasWhere: Record<string, unknown> = { tenant_id: tenantId, is_active: true };
    if (kelasId) kelasWhere.id = kelasId;

    const kelasList = await prisma.kelas.findMany({
      where: kelasWhere,
      select: { id: true, nama_kelas: true, jumlah_siswa: true },
    });

    const perKelas = await Promise.all(
      kelasList.map(async (k) => {
        const siswaIds = await prisma.siswa.findMany({
          where: { kelas_id: k.id, status: "aktif" },
          select: { id: true },
        });
        const ids = siswaIds.map((s) => s.id);

        if (ids.length === 0) return { kelas: k.nama_kelas, kelasId: k.id, hadir: 0, izin: 0, sakit: 0, alpha: 0, siswa: k.jumlah_siswa };

        const kelasPresensiWhere: Record<string, unknown> = { siswa_id: { in: ids } };
        if (Object.keys(dateFilter).length > 0) kelasPresensiWhere.tanggal = dateFilter;

        const kelasPresensi = await prisma.presensi.groupBy({
          by: ["status_masuk"],
          where: kelasPresensiWhere,
          _count: true,
        });

        const kelasTotal = kelasPresensi.reduce((sum, p) => sum + p._count, 0);
        const kelasHadir = (kelasPresensi.find((p) => p.status_masuk === "hadir")?._count || 0) +
          (kelasPresensi.find((p) => p.status_masuk === "terlambat")?._count || 0);
        const kelasIzin = kelasPresensi.find((p) => p.status_masuk === "izin")?._count || 0;
        const kelasAlpha = kelasPresensi.find((p) => p.status_masuk === "alpha")?._count || 0;
        const kelasSakit = kelasPresensi.find((p) => p.status_masuk === "sakit")?._count || 0;

        return {
          kelas: k.nama_kelas,
          kelasId: k.id,
          hadir: kelasTotal > 0 ? Math.round((kelasHadir / kelasTotal) * 1000) / 10 : 0,
          izin: kelasIzin,
          sakit: kelasSakit,
          alpha: kelasAlpha,
          siswa: k.jumlah_siswa,
        };
      })
    );

    return NextResponse.json({
      rataRataKehadiran,
      totalHadir,
      totalAlpha,
      totalSakit,
      totalIzin,
      perKelas,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
