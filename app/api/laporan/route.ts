import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    // Overall stats
    const allPresensi = await prisma.presensi.groupBy({
      by: ["status_masuk"],
      where: { tenant_id: tenantId },
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
    const kelasList = await prisma.kelas.findMany({
      where: { tenant_id: tenantId, is_active: true },
      select: { id: true, nama_kelas: true, jumlah_siswa: true },
    });

    const perKelas = await Promise.all(
      kelasList.map(async (k) => {
        const siswaIds = await prisma.siswa.findMany({
          where: { kelas_id: k.id, status: "aktif" },
          select: { id: true },
        });
        const ids = siswaIds.map((s) => s.id);

        if (ids.length === 0) return { kelas: k.nama_kelas, hadir: 0, siswa: k.jumlah_siswa };

        const kelasPresensi = await prisma.presensi.groupBy({
          by: ["status_masuk"],
          where: { siswa_id: { in: ids } },
          _count: true,
        });

        const kelasTotal = kelasPresensi.reduce((sum, p) => sum + p._count, 0);
        const kelasHadir = (kelasPresensi.find((p) => p.status_masuk === "hadir")?._count || 0) +
          (kelasPresensi.find((p) => p.status_masuk === "terlambat")?._count || 0);

        return {
          kelas: k.nama_kelas,
          hadir: kelasTotal > 0 ? Math.round((kelasHadir / kelasTotal) * 1000) / 10 : 0,
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
      bulanan: [],
      perKelas,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
