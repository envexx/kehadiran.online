import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { tenant_id: tenantId };

    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.notifikasi.findMany({
        where,
        include: { siswa: { select: { nama_lengkap: true } } },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notifikasi.count({ where }),
    ]);

    const mapped = data.map((n) => ({
      id: n.id,
      siswa: n.siswa.nama_lengkap,
      nomor_tujuan: n.nomor_tujuan,
      jenis: n.jenis_notifikasi,
      status: n.status,
      pesan: n.pesan,
      sent_at: n.sent_at,
    }));

    return NextResponse.json({ data: mapped, total, page, limit });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
