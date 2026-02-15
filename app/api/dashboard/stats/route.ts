import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";
import { todayStartWIB, todayEndWIB } from "@/lib/utils";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const today = todayStartWIB();
    const tomorrow = todayEndWIB();

    const [totalSiswa, siswaAktif, totalGuru, totalKelas, presensiHariIni] = await Promise.all([
      prisma.siswa.count({ where: { tenant_id: tenantId } }),
      prisma.siswa.count({ where: { tenant_id: tenantId, status: "aktif" } }),
      prisma.guru.count({ where: { tenant_id: tenantId, is_active: true } }),
      prisma.kelas.count({ where: { tenant_id: tenantId, is_active: true } }),
      prisma.presensi.groupBy({
        by: ["status_masuk"],
        where: { tenant_id: tenantId, tanggal: { gte: today, lt: tomorrow } },
        _count: true,
      }),
    ]);

    const hadirHariIni = presensiHariIni.find((p) => p.status_masuk === "hadir")?._count || 0;
    const terlambatHariIni = presensiHariIni.find((p) => p.status_masuk === "terlambat")?._count || 0;
    const alphaHariIni = presensiHariIni.find((p) => p.status_masuk === "alpha")?._count || 0;
    const izinHariIni = presensiHariIni.find((p) => p.status_masuk === "izin")?._count || 0;

    const totalPresensi = hadirHariIni + terlambatHariIni + alphaHariIni + izinHariIni;
    const persentaseKehadiran = totalPresensi > 0 ? Math.round(((hadirHariIni + terlambatHariIni) / totalPresensi) * 1000) / 10 : 0;

    // Weekly trend (last 5 weekdays)
    const trendMingguan = [];
    const hariNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    // Note: 'today' is already WIB-aware (00:00 WIB in UTC)

    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dNext = new Date(d);
      dNext.setDate(dNext.getDate() + 1);

      const dayData = await prisma.presensi.groupBy({
        by: ["status_masuk"],
        where: { tenant_id: tenantId, tanggal: { gte: d, lt: dNext } },
        _count: true,
      });

      // d is UTC representing WIB midnight, add offset to get correct WIB day
      const dWIB = new Date(d.getTime() + 7 * 60 * 60_000);
      trendMingguan.push({
        hari: hariNames[dWIB.getUTCDay()],
        hadir: (dayData.find((p) => p.status_masuk === "hadir")?._count || 0) + (dayData.find((p) => p.status_masuk === "terlambat")?._count || 0),
        alpha: dayData.find((p) => p.status_masuk === "alpha")?._count || 0,
        terlambat: dayData.find((p) => p.status_masuk === "terlambat")?._count || 0,
      });
    }

    // Yesterday's percentage
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayData = await prisma.presensi.groupBy({
      by: ["status_masuk"],
      where: { tenant_id: tenantId, tanggal: { gte: yesterday, lt: today } },
      _count: true,
    });
    const yesterdayTotal = yesterdayData.reduce((sum, p) => sum + p._count, 0);
    const yesterdayHadir = (yesterdayData.find((p) => p.status_masuk === "hadir")?._count || 0) + (yesterdayData.find((p) => p.status_masuk === "terlambat")?._count || 0);
    const persentaseKemarin = yesterdayTotal > 0 ? Math.round((yesterdayHadir / yesterdayTotal) * 1000) / 10 : 0;

    return NextResponse.json({
      totalSiswa,
      siswaAktif,
      totalGuru,
      totalKelas,
      hadirHariIni,
      terlambatHariIni,
      alphaHariIni,
      izinHariIni,
      persentaseKehadiran,
      persentaseKemarin,
      trendMingguan,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
