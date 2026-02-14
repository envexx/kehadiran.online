import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      skip,
      take: limit,
      orderBy: { issued_at: "desc" },
      include: { tenant: { select: { nama_sekolah: true } } },
    }),
    prisma.invoice.count(),
  ]);

  return NextResponse.json({
    data: invoices.map((inv: any) => ({
      id: inv.id,
      invoice_number: inv.invoice_number,
      tenant: inv.tenant.nama_sekolah,
      tenant_id: inv.tenant_id,
      amount: Number(inv.amount),
      status: inv.status,
      issued_at: inv.issued_at,
      due_at: inv.due_at,
      paid_at: inv.paid_at,
      payment_method: inv.payment_method,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
