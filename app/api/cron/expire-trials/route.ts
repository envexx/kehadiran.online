import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// This endpoint can be called by a cron job (e.g., Vercel Cron, or external cron service)
// to automatically expire trial subscriptions that have passed their end date.
// Recommended: run daily at 00:00 UTC

export async function GET(request: Request) {
  try {
    // Optional: verify cron secret for security
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && secret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find all trial subscriptions that have passed their end date
    const expiredTrials = await prisma.subscription.findMany({
      where: {
        status: "trial",
        ended_at: { lte: now },
      },
      include: {
        tenant: { select: { id: true, nama_sekolah: true } },
      },
    });

    if (expiredTrials.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired trials found",
        expired: 0,
      });
    }

    // Expire all found trials in a transaction
    const expiredIds = expiredTrials.map((s) => s.id);
    const tenantIds = expiredTrials.map((s) => s.tenant_id);

    await prisma.$transaction([
      // Update subscription status to expired
      prisma.subscription.updateMany({
        where: { id: { in: expiredIds } },
        data: { status: "expired" },
      }),
      // Deactivate the tenants whose trials expired
      prisma.tenant.updateMany({
        where: { id: { in: tenantIds } },
        data: { is_active: false },
      }),
    ]);

    const expiredNames = expiredTrials.map(
      (s) => `${s.tenant.nama_sekolah} (${s.tenant_id})`
    );

    return NextResponse.json({
      success: true,
      message: `Expired ${expiredTrials.length} trial(s)`,
      expired: expiredTrials.length,
      tenants: expiredNames,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cron expire-trials error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
