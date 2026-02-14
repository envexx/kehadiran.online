import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();
    const body = await request.json();
    const rows: Array<{
      nisn: string;
      nis?: string;
      nama_lengkap: string;
      jenis_kelamin: string;
      kelas_id: string;
      tempat_lahir?: string;
      tanggal_lahir?: string;
      nama_ayah?: string;
      nomor_wa_ayah?: string;
      nama_ibu?: string;
      nomor_wa_ibu?: string;
    }> = body.data;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Data kosong" }, { status: 400 });
    }

    const year = new Date().getFullYear();
    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      if (!row.nisn || !row.nama_lengkap || !row.jenis_kelamin || !row.kelas_id) {
        skipped++;
        errors.push(`Baris ${created + skipped}: data tidak lengkap (nisn/nama/jk/kelas wajib)`);
        continue;
      }
      try {
        await prisma.siswa.create({
          data: {
            tenant_id: tenantId,
            nisn: row.nisn,
            nis: row.nis || null,
            nama_lengkap: row.nama_lengkap,
            jenis_kelamin: row.jenis_kelamin,
            kelas_id: row.kelas_id,
            tempat_lahir: row.tempat_lahir || null,
            tanggal_lahir: row.tanggal_lahir ? new Date(row.tanggal_lahir) : null,
            nama_ayah: row.nama_ayah || null,
            nomor_wa_ayah: row.nomor_wa_ayah || null,
            nama_ibu: row.nama_ibu || null,
            nomor_wa_ibu: row.nomor_wa_ibu || null,
            tahun_masuk: year,
          },
        });
        created++;
      } catch (e: unknown) {
        skipped++;
        const msg = e instanceof Error ? e.message : "Unknown";
        if (msg.includes("Unique")) {
          errors.push(`NISN ${row.nisn} sudah terdaftar`);
        } else {
          errors.push(`Baris ${created + skipped}: ${msg}`);
        }
      }
    }

    return NextResponse.json({ success: true, created, skipped, errors: errors.slice(0, 10) });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
