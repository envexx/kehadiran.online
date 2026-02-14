import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();
    const body = await request.json();
    const { jumlah_siswa, billing_cycle } = body;

    if (!jumlah_siswa || jumlah_siswa < 1) {
      return NextResponse.json({ error: "Jumlah siswa harus minimal 1" }, { status: 400 });
    }

    // Fetch plans from DB and auto-determine based on jumlah siswa
    const plans = await prisma.pricingPlan.findMany({
      where: { is_active: true },
      orderBy: { min_siswa: "asc" },
    });

    if (plans.length === 0) {
      return NextResponse.json({ error: "Belum ada paket tersedia" }, { status: 400 });
    }

    // Find matching plan: last plan where min_siswa <= jumlah_siswa
    const matchedPlan = plans.reduce((best, p) => {
      if (jumlah_siswa >= p.min_siswa) return p;
      return best;
    }, plans[0]);

    const pricePerSiswa = Number(matchedPlan.price_per_siswa);
    const cycle = billing_cycle || "monthly";

    // Harga = harga per siswa × jumlah siswa × bulan
    const months = cycle === "annual" ? 10 : 1; // annual = 10 bulan (2 bulan gratis)
    const totalAmount = pricePerSiswa * jumlah_siswa * months;

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
        plan: matchedPlan.key,
        status: "active",
        billing_cycle: cycle,
        amount: totalAmount,
        started_at: now,
        ended_at: endDate,
        canceled_at: null,
      },
      create: {
        tenant_id: tenantId,
        plan: matchedPlan.key,
        status: "active",
        billing_cycle: cycle,
        amount: totalAmount,
        currency: "IDR",
        started_at: now,
        ended_at: endDate,
      },
    });

    // Update feature quotas — max_siswa = jumlah yang diinput user
    await prisma.featureQuota.upsert({
      where: { tenant_id: tenantId },
      update: {
        max_siswa: jumlah_siswa,
        max_guru: matchedPlan.max_guru,
        max_kelas: matchedPlan.max_kelas,
        sms_quota: matchedPlan.sms_quota,
        api_calls: matchedPlan.api_calls,
        storage_gb: matchedPlan.storage_gb,
      },
      create: {
        tenant_id: tenantId,
        max_siswa: jumlah_siswa,
        max_guru: matchedPlan.max_guru,
        max_kelas: matchedPlan.max_kelas,
        sms_quota: matchedPlan.sms_quota,
        api_calls: matchedPlan.api_calls,
        storage_gb: matchedPlan.storage_gb,
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
        notes: `Paket ${matchedPlan.name} (${cycle}) - ${jumlah_siswa} siswa × Rp ${pricePerSiswa.toLocaleString("id-ID")}/siswa`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        plan: subscription.plan,
        status: subscription.status,
        billing_cycle: subscription.billing_cycle,
        amount: Number(subscription.amount),
        pricePerSiswa,
        jumlahSiswa: jumlah_siswa,
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
