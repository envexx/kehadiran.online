import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();
    const body = await request.json();
    const items: Array<{
      hari: string;
      jam_masuk: string;
      jam_pulang: string;
      is_active: boolean;
    }> = body.data;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Data kosong" }, { status: 400 });
    }

    const results = [];
    for (const item of items) {
      const result = await prisma.jadwal.upsert({
        where: { tenant_id_hari: { tenant_id: tenantId, hari: item.hari } },
        update: {
          jam_masuk: item.jam_masuk,
          jam_pulang: item.jam_pulang,
          is_active: item.is_active,
        },
        create: {
          tenant_id: tenantId,
          hari: item.hari,
          jam_masuk: item.jam_masuk,
          jam_pulang: item.jam_pulang,
          is_active: item.is_active,
        },
      });
      results.push(result);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
