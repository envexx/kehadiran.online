import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      { id: "inv1", invoice_number: "INV-2025-001", amount: 599000, status: "paid", issued_at: "2025-01-01", paid_at: "2025-01-02", payment_method: "bank_transfer" },
      { id: "inv2", invoice_number: "INV-2025-002", amount: 599000, status: "paid", issued_at: "2025-02-01", paid_at: "2025-02-02", payment_method: "bank_transfer" },
      { id: "inv3", invoice_number: "INV-2025-003", amount: 599000, status: "pending", issued_at: "2025-03-01", paid_at: null, payment_method: null },
    ],
  });
}
