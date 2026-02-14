import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, status]
  return NextResponse.json({
    total: 1248,
    aktif: 1180,
    lulus: 45,
    pindah: 15,
    keluar: 8,
  });
}
