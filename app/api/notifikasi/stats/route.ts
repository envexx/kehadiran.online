import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    total: 4520,
    sent: 4200,
    pending: 180,
    failed: 140,
    deliveryRate: 93.0,
  });
}
