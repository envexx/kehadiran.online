import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const [total, aktif, totalSiswa] = await Promise.all([
      prisma.kelas.count({ where: { tenant_id: tenantId } }),
      prisma.kelas.count({ where: { tenant_id: tenantId, is_active: true } }),
      prisma.siswa.count({ where: { tenant_id: tenantId, status: "aktif" } }),
    ]);

    const rataRataPerKelas = aktif > 0 ? Math.round(totalSiswa / aktif) : 0;

    return NextResponse.json({ total, aktif, totalSiswa, rataRataPerKelas });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
