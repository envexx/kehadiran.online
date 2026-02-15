import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";
import { sendPresensiNotification } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const { tenantId, userId } = await requireTenantAuth();
    const body = await request.json();
    const { siswa_id, tenant_id: qrTenantId } = body;

    if (!siswa_id) {
      return NextResponse.json({ error: "QR Code tidak valid" }, { status: 400 });
    }

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

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Find today's presensi record
    const presensi = await prisma.presensi.findFirst({
      where: { tenant_id: tenantId, siswa_id, tanggal: { gte: todayStart, lt: todayEnd } },
    });

    if (!presensi) {
      return NextResponse.json({ error: "Siswa belum melakukan presensi masuk hari ini" }, { status: 400 });
    }

    if (presensi.waktu_pulang) {
      return NextResponse.json({
        error: "Siswa sudah melakukan presensi pulang hari ini",
        already: true,
        nama: siswa.nama_lengkap,
        kelas: siswa.kelas.nama_kelas,
      }, { status: 409 });
    }

    // Update with pulang time
    await prisma.presensi.update({
      where: { id: presensi.id },
      data: {
        waktu_pulang: now,
        status_pulang: "pulang",
      },
    });

    const waktuStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    // Fire-and-forget: send WA pulang notification to parent
    sendPresensiNotification({
      siswaId: siswa_id,
      tenantId,
      status: "pulang",
      waktu: waktuStr,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: presensi.id,
        nama: siswa.nama_lengkap,
        kelas: siswa.kelas.nama_kelas,
        status: "Pulang",
        waktu: waktuStr,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
