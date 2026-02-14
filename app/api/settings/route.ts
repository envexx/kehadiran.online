import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = { tenant_id: tenantId };

    if (category) where.category = category;

    const data = await prisma.setting.findMany({ where, orderBy: { key: "asc" } });

    return NextResponse.json({ data });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { tenantId, userId } = await requireTenantAuth();
    const body = await request.json();

    // body should be { key, value, category? }
    const setting = await prisma.setting.upsert({
      where: { tenant_id_key: { tenant_id: tenantId, key: body.key } },
      update: { value: body.value, updated_by: userId },
      create: {
        tenant_id: tenantId,
        key: body.key,
        value: body.value,
        category: body.category || "general",
        updated_by: userId,
      },
    });

    return NextResponse.json({ success: true, data: setting });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
