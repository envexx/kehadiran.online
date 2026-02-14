import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

// Harga per siswa per bulan
const PLAN_CONFIG: Record<string, { pricePerSiswa: number; max_siswa: number; max_guru: number; max_kelas: number; sms_quota: number; api_calls: number; storage_gb: number }> = {
  starter: { pricePerSiswa: 9999, max_siswa: 100, max_guru: 20, max_kelas: 10, sms_quota: 1000, api_calls: 10000, storage_gb: 1 },
  pro: { pricePerSiswa: 12500, max_siswa: 500, max_guru: 50, max_kelas: 30, sms_quota: 5000, api_calls: 50000, storage_gb: 5 },
  enterprise: { pricePerSiswa: 15000, max_siswa: 2000, max_guru: 200, max_kelas: 100, sms_quota: 20000, api_calls: 200000, storage_gb: 20 },
};

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();
    const body = await request.json();
    const { plan, billing_cycle } = body;

    if (!plan || !PLAN_CONFIG[plan]) {
      return NextResponse.json({ error: "Plan tidak valid" }, { status: 400 });
    }

    const config = PLAN_CONFIG[plan];
    const cycle = billing_cycle || "monthly";

    // Count actual active students for this tenant
    const jumlahSiswa = await prisma.siswa.count({
      where: { tenant_id: tenantId, status: "aktif" },
    });

    if (jumlahSiswa === 0) {
      return NextResponse.json({ error: "Belum ada siswa aktif. Tambahkan siswa terlebih dahulu." }, { status: 400 });
    }

    // Harga = harga per siswa × jumlah siswa × bulan
    const months = cycle === "annual" ? 10 : 1; // annual = 10 bulan (2 bulan gratis)
    const totalAmount = config.pricePerSiswa * jumlahSiswa * months;

    // Get current subscription
    const currentSub = await prisma.subscription.findUnique({
      where: { tenant_id: tenantId },
    });

    if (currentSub && currentSub.plan === plan) {
      return NextResponse.json({ error: "Anda sudah menggunakan paket ini" }, { status: 400 });
    }

    const now = new Date();
    const endDate = new Date(now);
    if (cycle === "annual") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Update or create subscription
    const subscription = await prisma.subscription.upsert({
      where: { tenant_id: tenantId },
      update: {
        plan,
        status: "active",
        billing_cycle: cycle,
        amount: totalAmount,
        started_at: now,
        ended_at: endDate,
        canceled_at: null,
      },
      create: {
        tenant_id: tenantId,
        plan,
        status: "active",
        billing_cycle: cycle,
        amount: totalAmount,
        currency: "IDR",
        started_at: now,
        ended_at: endDate,
      },
    });

    // Update feature quotas
    await prisma.featureQuota.upsert({
      where: { tenant_id: tenantId },
      update: {
        max_siswa: config.max_siswa,
        max_guru: config.max_guru,
        max_kelas: config.max_kelas,
        sms_quota: config.sms_quota,
        api_calls: config.api_calls,
        storage_gb: config.storage_gb,
      },
      create: {
        tenant_id: tenantId,
        max_siswa: config.max_siswa,
        max_guru: config.max_guru,
        max_kelas: config.max_kelas,
        sms_quota: config.sms_quota,
        api_calls: config.api_calls,
        storage_gb: config.storage_gb,
      },
    });

    // Create invoice
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 7);

    await prisma.invoice.create({
      data: {
        tenant_id: tenantId,
        invoice_number: invoiceNumber,
        amount: totalAmount,
        status: "sent",
        issued_at: now,
        due_at: dueDate,
        notes: `Upgrade ke paket ${plan} (${cycle}) - ${jumlahSiswa} siswa × Rp ${config.pricePerSiswa.toLocaleString("id-ID")}/siswa`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        plan: subscription.plan,
        status: subscription.status,
        billing_cycle: subscription.billing_cycle,
        amount: Number(subscription.amount),
        pricePerSiswa: config.pricePerSiswa,
        jumlahSiswa,
        started_at: subscription.started_at,
        ended_at: subscription.ended_at,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
