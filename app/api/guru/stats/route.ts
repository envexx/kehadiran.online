import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    total: 86,
    aktif: 82,
    nonAktif: 4,
    punyaAkun: 68,
  });
}
