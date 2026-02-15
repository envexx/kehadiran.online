import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";
import { sendPresensiNotification } from "@/lib/whatsapp";
import { dayNameWIB, todayStartWIB, todayEndWIB, nowHoursMinutesWIB, formatTimeWIB } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { tenantId, userId } = await requireTenantAuth();
    const body = await request.json();
    const { siswa_id, tenant_id: qrTenantId } = body;

    if (!siswa_id) {
      return NextResponse.json({ error: "QR Code tidak valid" }, { status: 400 });
    }

    // Validate tenant_id from QR matches the logged-in tenant
    if (qrTenantId && qrTenantId !== tenantId) {
      return NextResponse.json({ error: "QR Code bukan milik sekolah ini" }, { status: 403 });
    }

    // Verify siswa belongs to this tenant
    const siswa = await prisma.siswa.findFirst({
      where: { id: siswa_id, tenant_id: tenantId },
      include: { kelas: { select: { nama_kelas: true } } },
    });
    if (!siswa) {
      return NextResponse.json({ error: "Siswa tidak ditemukan di sekolah ini" }, { status: 404 });
    }

    // Get today's day name in WIB
    const now = new Date();
    const todayDay = dayNameWIB();

    // Find active jadwal for today
    const jadwal = await prisma.jadwal.findFirst({
      where: { tenant_id: tenantId, hari: todayDay, is_active: true },
    });
    if (!jadwal) {
      return NextResponse.json({ error: `Tidak ada jadwal aktif untuk hari ${todayDay}` }, { status: 400 });
    }

    // Check if already recorded today (WIB)
    const todayStart = todayStartWIB();
    const todayEnd = todayEndWIB();

    const existing = await prisma.presensi.findFirst({
      where: { tenant_id: tenantId, siswa_id, tanggal: { gte: todayStart, lt: todayEnd } },
    });
    if (existing) {
      return NextResponse.json({
        error: "Siswa sudah melakukan presensi hari ini",
        already: true,
        nama: siswa.nama_lengkap,
        kelas: siswa.kelas.nama_kelas,
      }, { status: 409 });
    }

    // Determine status based on jam_masuk (WIB)
    const [jamH, jamM] = jadwal.jam_masuk.split(":").map(Number);
    const { hours: nowH, minutes: nowM } = nowHoursMinutesWIB();
    const nowMinutes = nowH * 60 + nowM;
    const jadwalMinutes = jamH * 60 + jamM;

    const status = nowMinutes <= jadwalMinutes ? "hadir" : "terlambat";

    // Create presensi record
    const presensi = await prisma.presensi.create({
      data: {
        tenant_id: tenantId,
        siswa_id,
        jadwal_id: jadwal.id,
        tanggal: todayStart,
        waktu_masuk: now,
        status_masuk: status,
        metode_input: "qr_code",
        input_by: userId,
      },
    });

    const statusLabel = status === "hadir" ? "Hadir" : "Terlambat";
    const waktuStr = formatTimeWIB(now);

    // Fire-and-forget: send WA notification to parent
    sendPresensiNotification({
      siswaId: siswa_id,
      tenantId,
      status: status as "hadir" | "terlambat",
      waktu: waktuStr,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: presensi.id,
        nama: siswa.nama_lengkap,
        kelas: siswa.kelas.nama_kelas,
        status: statusLabel,
        waktu: waktuStr,
      },
    }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
