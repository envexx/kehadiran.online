import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const data = await prisma.presensi.findMany({
      where: { tenant_id: tenantId },
      include: {
        siswa: {
          select: { nama_lengkap: true, kelas: { select: { nama_kelas: true } } },
        },
      },
      orderBy: { created_at: "desc" },
      take: limit,
    });

    const statusMap: Record<string, string> = {
      hadir: "Hadir",
      terlambat: "Terlambat",
      alpha: "Alpha",
      izin: "Izin",
      sakit: "Sakit",
    };

    const metodeMap: Record<string, string> = {
      qr_code: "QR Code",
      manual: "Manual",
      fingerprint: "Fingerprint",
    };

    const mapped = data.map((p) => ({
      id: p.id,
      nama: p.siswa.nama_lengkap,
      kelas: p.siswa.kelas.nama_kelas,
      waktu: p.waktu_masuk ? p.waktu_masuk.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "—",
      status: statusMap[p.status_masuk] || p.status_masuk,
      metode: metodeMap[p.metode_input] || p.metode_input,
    }));

    return NextResponse.json({ data: mapped, total: mapped.length });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
