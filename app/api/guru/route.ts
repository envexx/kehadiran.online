import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = { tenant_id: tenantId };

    if (search) {
      where.OR = [
        { nama_guru: { contains: search, mode: "insensitive" } },
        { nip: { contains: search } },
      ];
    }

    const data = await prisma.guru.findMany({
      where,
      orderBy: { nama_guru: "asc" },
    });

    return NextResponse.json({ data, total: data.length });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();
    const body = await request.json();

    const guru = await prisma.guru.create({
      data: {
        tenant_id: tenantId,
        nama_guru: body.nama_guru,
        nip: body.nip || null,
        email: body.email || null,
        nomor_telepon: body.nomor_telepon || null,
        nomor_wa: body.nomor_wa || null,
        is_active: true,
      },
    });

    return NextResponse.json({ success: true, data: guru }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
