import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const subscription = await prisma.subscription.findUnique({
      where: { tenant_id: tenantId },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const quota = await prisma.featureQuota.findUnique({
      where: { tenant_id: tenantId },
    });

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      billing_cycle: subscription.billing_cycle,
      amount: Number(subscription.amount),
      currency: subscription.currency,
      started_at: subscription.started_at,
      ended_at: subscription.ended_at,
      features: quota ? {
        max_siswa: quota.max_siswa,
        max_guru: quota.max_guru,
        max_kelas: quota.max_kelas,
        wa_quota: quota.sms_quota,
      } : null,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
