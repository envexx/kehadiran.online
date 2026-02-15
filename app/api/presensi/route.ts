import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";
import { sendPresensiNotification } from "@/lib/whatsapp";
import { todayDateStringWIB, dateStringToStartWIB, dateStringToEndWIB, formatTimeWIB } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantAuth();

    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal") || todayDateStringWIB();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const dateStart = dateStringToStartWIB(tanggal);
    const dateEnd = dateStringToEndWIB(tanggal);

    const where = {
      tenant_id: tenantId,
      tanggal: { gte: dateStart, lt: dateEnd },
    };

    const [data, total] = await Promise.all([
      prisma.presensi.findMany({
        where,
        include: {
          siswa: {
            select: { nama_lengkap: true, kelas: { select: { nama_kelas: true } } },
          },
        },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.presensi.count({ where }),
    ]);

    const mapped = data.map((p) => ({
      id: p.id,
      siswa_id: p.siswa_id,
      nama: p.siswa.nama_lengkap,
      kelas: p.siswa.kelas.nama_kelas,
      tanggal: p.tanggal.toISOString().split("T")[0],
      waktu_masuk: p.waktu_masuk ? formatTimeWIB(p.waktu_masuk) : null,
      status_masuk: p.status_masuk,
      metode_input: p.metode_input,
    }));

    return NextResponse.json({ data: mapped, total, page, limit });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId, userId } = await requireTenantAuth();
    const body = await request.json();

    const statusMasuk = body.status_masuk || "hadir";

    const presensi = await prisma.presensi.create({
      data: {
        tenant_id: tenantId,
        siswa_id: body.siswa_id,
        jadwal_id: body.jadwal_id,
        tanggal: new Date(body.tanggal || new Date().toISOString().split("T")[0]),
        waktu_masuk: body.waktu_masuk ? new Date(body.waktu_masuk) : new Date(),
        status_masuk: statusMasuk,
        metode_input: body.metode_input || "manual",
        keterangan: body.keterangan || null,
        input_by: userId,
      },
    });

    // Fire-and-forget: send WA notification (hadir, terlambat, alpha only)
    const notifStatuses = ["hadir", "terlambat", "alpha"];
    if (notifStatuses.includes(statusMasuk)) {
      const waktuStr = formatTimeWIB(new Date());
      sendPresensiNotification({
        siswaId: body.siswa_id,
        tenantId,
        status: statusMasuk as "hadir" | "terlambat" | "alpha",
        waktu: waktuStr,
      });
    }

    return NextResponse.json({ success: true, data: presensi }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
