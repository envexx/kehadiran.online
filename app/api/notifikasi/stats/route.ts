import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const counts = await prisma.notifikasi.groupBy({
      by: ["status"],
      where: { tenant_id: tenantId },
      _count: true,
    });

    const total = counts.reduce((sum, c) => sum + c._count, 0);
    const sent = counts.find((c) => c.status === "sent")?._count || 0;
    const delivered = counts.find((c) => c.status === "delivered")?._count || 0;
    const pending = counts.find((c) => c.status === "pending")?._count || 0;
    const failed = counts.find((c) => c.status === "failed")?._count || 0;
    const deliveryRate = total > 0 ? Math.round(((sent + delivered) / total) * 1000) / 10 : 0;

    return NextResponse.json({ total, sent: sent + delivered, pending, failed, deliveryRate });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
