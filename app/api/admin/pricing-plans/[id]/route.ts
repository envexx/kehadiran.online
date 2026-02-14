import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

async function requireSuperAdmin() {
  const { userId } = await requireTenantAuth();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "superadmin") throw new Error("FORBIDDEN");
  return { userId };
}

// PUT update plan
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSuperAdmin();
    const { id } = await params;
    const body = await request.json();

    const plan = await prisma.pricingPlan.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price_per_siswa !== undefined && { price_per_siswa: body.price_per_siswa }),
        ...(body.original_price !== undefined && { original_price: body.original_price }),
        ...(body.min_siswa !== undefined && { min_siswa: body.min_siswa }),
        ...(body.max_siswa !== undefined && { max_siswa: body.max_siswa }),
        ...(body.max_guru !== undefined && { max_guru: body.max_guru }),
        ...(body.max_kelas !== undefined && { max_kelas: body.max_kelas }),
        ...(body.sms_quota !== undefined && { sms_quota: body.sms_quota }),
        ...(body.api_calls !== undefined && { api_calls: body.api_calls }),
        ...(body.storage_gb !== undefined && { storage_gb: body.storage_gb }),
        ...(body.features !== undefined && { features: body.features }),
        ...(body.is_popular !== undefined && { is_popular: body.is_popular }),
        ...(body.is_active !== undefined && { is_active: body.is_active }),
        ...(body.sort_order !== undefined && { sort_order: body.sort_order }),
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

// DELETE plan
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSuperAdmin();
    const { id } = await params;

    await prisma.pricingPlan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof Error && e.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
