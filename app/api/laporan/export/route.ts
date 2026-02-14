import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const kelasId = searchParams.get("kelasId");

    // Build date filter
    const dateFilter: Record<string, unknown> = {};
    if (startDate) {
      const sd = new Date(startDate);
      sd.setHours(0, 0, 0, 0);
      dateFilter.gte = sd;
    }
    if (endDate) {
      const ed = new Date(endDate);
      ed.setHours(23, 59, 59, 999);
      dateFilter.lt = new Date(ed.getTime() + 1);
    }

    const presensiWhere: Record<string, unknown> = { tenant_id: tenantId };
    if (Object.keys(dateFilter).length > 0) presensiWhere.tanggal = dateFilter;

    // If kelasId, filter by siswa in that kelas
    let siswaFilter: string[] | undefined;
    if (kelasId) {
      const siswaIds = await prisma.siswa.findMany({
        where: { kelas_id: kelasId, status: "aktif" },
        select: { id: true },
      });
      siswaFilter = siswaIds.map(s => s.id);
      if (siswaFilter.length > 0) {
        presensiWhere.siswa_id = { in: siswaFilter };
      }
    }

    const data = await prisma.presensi.findMany({
      where: presensiWhere,
      include: {
        siswa: { select: { nama_lengkap: true, nisn: true, kelas: { select: { nama_kelas: true } } } },
      },
      orderBy: [{ tanggal: "asc" }, { waktu_masuk: "asc" }],
    });

    // Build CSV
    const header = "No,Tanggal,NISN,Nama Siswa,Kelas,Waktu Masuk,Status,Keterangan";
    const rows = data.map((p, i) => {
      const tanggal = p.tanggal.toISOString().split("T")[0];
      const waktu = p.waktu_masuk ? p.waktu_masuk.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";
      const status = p.status_masuk.charAt(0).toUpperCase() + p.status_masuk.slice(1);
      return `${i + 1},"${tanggal}","${p.siswa.nisn}","${p.siswa.nama_lengkap}","${p.siswa.kelas.nama_kelas}","${waktu}","${status}","${p.keterangan || ""}"`;
    });

    const csv = [header, ...rows].join("\n");
    const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility

    const dateLabel = startDate && endDate ? `${startDate}_${endDate}` : "semua";

    return new NextResponse(bom + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Laporan_Presensi_${dateLabel}.csv"`,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
