import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

async function requireSuperAdmin() {
  const { userId } = await requireTenantAuth();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "superadmin") throw new Error("FORBIDDEN");
  return { userId };
}

// GET global settings (superadmin only)
export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    const data = await prisma.globalSetting.findMany({ where, orderBy: { key: "asc" } });
    return NextResponse.json({ data });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof Error && e.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT upsert global setting
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await requireSuperAdmin();
    const body = await request.json();

    const setting = await prisma.globalSetting.upsert({
      where: { key: body.key },
      update: { value: body.value, category: body.category || "general", updated_by: userId },
      create: {
        key: body.key,
        value: body.value,
        category: body.category || "general",
        updated_by: userId,
      },
    });

    return NextResponse.json({ success: true, data: setting });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof Error && e.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
