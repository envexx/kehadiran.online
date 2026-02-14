import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [tenantCount, userCount, siswaCount, activeSubs, emailSent, emailFailed, emailPending] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.siswa.count(),
    prisma.subscription.findMany({ where: { status: "active" }, select: { amount: true } }),
    prisma.emailLog.count({ where: { status: "sent" } }),
    prisma.emailLog.count({ where: { status: "failed" } }),
    prisma.emailLog.count({ where: { status: "pending" } }),
  ]);

  const mrr = activeSubs.reduce((sum: number, s: { amount: unknown }) => sum + Number(s.amount), 0);

  const recentTenants = await prisma.tenant.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
    include: {
      subscription: { select: { plan: true, status: true } },
      _count: { select: { siswa: true } },
    },
  });

  return NextResponse.json({
    stats: { tenants: tenantCount, users: userCount, siswa: siswaCount, mrr },
    emailStats: { sent: emailSent, failed: emailFailed, pending: emailPending },
    recentTenants: recentTenants.map((t: any) => ({
      id: t.id,
      nama: t.nama_sekolah,
      slug: t.slug,
      is_active: t.is_active,
      siswa: t._count.siswa,
      plan: t.subscription?.plan || "free",
      status: t.subscription?.status || "inactive",
      created_at: t.created_at,
    })),
  });
}
