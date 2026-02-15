import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";
import { todayStartWIB, todayEndWIB } from "@/lib/utils";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const today = todayStartWIB();
    const tomorrow = todayEndWIB();

    const [totalSiswa, presensiData] = await Promise.all([
      prisma.siswa.count({ where: { tenant_id: tenantId, status: "aktif" } }),
      prisma.presensi.groupBy({
        by: ["status_masuk"],
        where: { tenant_id: tenantId, tanggal: { gte: today, lt: tomorrow } },
        _count: true,
      }),
    ]);

    const hadir = presensiData.find((p) => p.status_masuk === "hadir")?._count || 0;
    const terlambat = presensiData.find((p) => p.status_masuk === "terlambat")?._count || 0;
    const alpha = presensiData.find((p) => p.status_masuk === "alpha")?._count || 0;
    const izin = presensiData.find((p) => p.status_masuk === "izin")?._count || 0;
    const sakit = presensiData.find((p) => p.status_masuk === "sakit")?._count || 0;

    const totalPresensi = hadir + terlambat + alpha + izin + sakit;
    const persentase = totalPresensi > 0 ? Math.round(((hadir + terlambat) / totalPresensi) * 1000) / 10 : 0;

    return NextResponse.json({ totalSiswa, hadir, terlambat, alpha, izin, sakit, persentase });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
