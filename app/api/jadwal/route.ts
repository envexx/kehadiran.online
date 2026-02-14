import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const data = await prisma.jadwal.findMany({
      where: { tenant_id: tenantId },
      orderBy: { hari: "asc" },
    });

    return NextResponse.json({ data });
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

    const jadwal = await prisma.jadwal.create({
      data: {
        tenant_id: tenantId,
        hari: body.hari,
        jam_masuk: body.jam_masuk,
        jam_pulang: body.jam_pulang,
        is_active: body.is_active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: jadwal }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
