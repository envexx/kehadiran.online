import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const counts = await prisma.siswa.groupBy({
      by: ["status"],
      where: { tenant_id: tenantId },
      _count: true,
    });

    const total = counts.reduce((sum, c) => sum + c._count, 0);
    const aktif = counts.find((c) => c.status === "aktif")?._count || 0;
    const lulus = counts.find((c) => c.status === "lulus")?._count || 0;
    const pindah = counts.find((c) => c.status === "pindah")?._count || 0;
    const keluar = counts.find((c) => c.status === "keluar")?._count || 0;

    return NextResponse.json({ total, aktif, lulus, pindah, keluar });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
