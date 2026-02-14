import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();
    const { searchParams } = new URL(request.url);
    const kelasId = searchParams.get("kelasId") || "";

    const where: Record<string, unknown> = { tenant_id: tenantId };
    if (kelasId) where.kelas_id = kelasId;

    const students = await prisma.siswa.findMany({
      where,
      include: { kelas: { select: { nama_kelas: true } } },
      orderBy: { nama_lengkap: "asc" },
    });

    const header = "NISN,NIS,Nama Lengkap,Jenis Kelamin,Kelas,Tempat Lahir,Tanggal Lahir,Status,Nama Ayah,WA Ayah,Nama Ibu,WA Ibu";
    const rows = students.map((s) => {
      const tgl = s.tanggal_lahir ? new Date(s.tanggal_lahir).toISOString().split("T")[0] : "";
      return [
        s.nisn,
        s.nis || "",
        `"${s.nama_lengkap}"`,
        s.jenis_kelamin,
        `"${s.kelas?.nama_kelas || ""}"`,
        `"${s.tempat_lahir || ""}"`,
        tgl,
        s.status,
        `"${s.nama_ayah || ""}"`,
        s.nomor_wa_ayah || "",
        `"${s.nama_ibu || ""}"`,
        s.nomor_wa_ibu || "",
      ].join(",");
    });

    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="data-siswa-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
