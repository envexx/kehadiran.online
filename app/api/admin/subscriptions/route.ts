import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const [subs, total, planStats] = await Promise.all([
    prisma.subscription.findMany({
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: { tenant: { select: { nama_sekolah: true } } },
    }),
    prisma.subscription.count(),
    prisma.subscription.groupBy({
      by: ["plan"],
      _count: true,
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    data: subs.map((s: any) => ({
      id: s.id,
      tenant: s.tenant.nama_sekolah,
      tenant_id: s.tenant_id,
      plan: s.plan,
      status: s.status,
      billing_cycle: s.billing_cycle,
      amount: Number(s.amount),
      started_at: s.started_at,
      ended_at: s.ended_at,
    })),
    planStats: planStats.map((p: any) => ({
      plan: p.plan,
      count: p._count,
      revenue: Number(p._sum.amount || 0),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
