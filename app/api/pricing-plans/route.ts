import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public GET — anyone can see active pricing plans
export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: { is_active: true },
      orderBy: { sort_order: "asc" },
    });

    return NextResponse.json({
      data: plans.map((p) => ({
        id: p.id,
        key: p.key,
        name: p.name,
        description: p.description,
        price_per_siswa: Number(p.price_per_siswa),
        original_price: p.original_price ? Number(p.original_price) : null,
        min_siswa: p.min_siswa,
        max_siswa: p.max_siswa,
        max_guru: p.max_guru,
        max_kelas: p.max_kelas,
        sms_quota: p.sms_quota,
        api_calls: p.api_calls,
        storage_gb: Number(p.storage_gb),
        features: p.features,
        is_popular: p.is_popular,
        sort_order: p.sort_order,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
