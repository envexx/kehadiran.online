import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAuth();

    const data = await prisma.invoice.findMany({
      where: { tenant_id: tenantId },
      orderBy: { issued_at: "desc" },
    });

    return NextResponse.json({
      data: data.map((inv) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        amount: Number(inv.amount),
        status: inv.status,
        issued_at: inv.issued_at,
        paid_at: inv.paid_at,
        payment_method: inv.payment_method,
      })),
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
