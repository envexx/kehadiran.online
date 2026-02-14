import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { tenantId, userId } = await requireTenantAuth();
    const body = await request.json();
    const { siswa_id } = body;

    if (!siswa_id) {
      return NextResponse.json({ error: "QR Code tidak valid" }, { status: 400 });
    }

    // Verify siswa belongs to this tenant
    const siswa = await prisma.siswa.findFirst({
      where: { id: siswa_id, tenant_id: tenantId },
      include: { kelas: { select: { nama_kelas: true } } },
    });
    if (!siswa) {
      return NextResponse.json({ error: "Siswa tidak ditemukan di sekolah ini" }, { status: 404 });
    }

    // Get today's day name
    const dayNames = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
    const now = new Date();
    const todayDay = dayNames[now.getDay()];

    // Find active jadwal for today
    const jadwal = await prisma.jadwal.findFirst({
      where: { tenant_id: tenantId, hari: todayDay, is_active: true },
    });
    if (!jadwal) {
      return NextResponse.json({ error: `Tidak ada jadwal aktif untuk hari ${todayDay}` }, { status: 400 });
    }

    // Check if already recorded today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

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

    // Determine status based on jam_masuk
    const [jamH, jamM] = jadwal.jam_masuk.split(":").map(Number);
    const jamMasukDate = new Date(now);
    jamMasukDate.setHours(jamH, jamM, 0, 0);

    const status = now <= jamMasukDate ? "hadir" : "terlambat";

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
    const waktuStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

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
