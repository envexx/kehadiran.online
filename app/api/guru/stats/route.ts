import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const [total, aktif, nonAktif, punyaAkun] = await Promise.all([
      prisma.guru.count({ where: { tenant_id: tenantId } }),
      prisma.guru.count({ where: { tenant_id: tenantId, is_active: true } }),
      prisma.guru.count({ where: { tenant_id: tenantId, is_active: false } }),
      prisma.guru.count({ where: { tenant_id: tenantId, user_id: { not: null } } }),
    ]);

    return NextResponse.json({ total, aktif, nonAktif, punyaAkun });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
