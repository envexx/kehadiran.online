import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdminAuth } from "@/lib/auth";

async function requireSuperAdmin() {
  const { userId } = await requireSuperAdminAuth();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "superadmin") throw new Error("FORBIDDEN");
  return { userId };
}

// GET all plans (including inactive) for superadmin
export async function GET() {
  try {
    await requireSuperAdmin();
    const plans = await prisma.pricingPlan.findMany({ orderBy: { sort_order: "asc" } });
    return NextResponse.json({
      data: plans.map((p) => ({
        ...p,
        price_per_siswa: Number(p.price_per_siswa),
        original_price: p.original_price ? Number(p.original_price) : null,
        storage_gb: Number(p.storage_gb),
      })),
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof Error && e.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create new plan
export async function POST(request: NextRequest) {
  try {
    await requireSuperAdmin();
    const body = await request.json();

    const plan = await prisma.pricingPlan.create({
      data: {
        key: body.key,
        name: body.name,
        description: body.description || null,
        price_per_siswa: body.price_per_siswa,
        original_price: body.original_price || null,
        min_siswa: body.min_siswa || 1,
        max_siswa: body.max_siswa || 100,
        max_guru: body.max_guru || 20,
        max_kelas: body.max_kelas || 10,
        sms_quota: body.sms_quota || 1000,
        api_calls: body.api_calls || 10000,
        storage_gb: body.storage_gb || 1,
        features: body.features || [],
        is_popular: body.is_popular || false,
        is_active: body.is_active !== false,
        sort_order: body.sort_order || 0,
      },
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof Error && e.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
