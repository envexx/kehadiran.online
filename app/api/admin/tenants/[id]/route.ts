import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      subscription: true,
      _count: { select: { siswa: true, users: true, gurus: true, kelas: true } },
    },
  });
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  return NextResponse.json({ data: tenant });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...(body.nama_sekolah && { nama_sekolah: body.nama_sekolah }),
        ...(body.slug && { slug: body.slug }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.alamat !== undefined && { alamat: body.alamat }),
        ...(body.nomor_telepon !== undefined && { nomor_telepon: body.nomor_telepon }),
        ...(body.is_active !== undefined && { is_active: body.is_active }),
      },
    });
    return NextResponse.json({ success: true, data: tenant });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant tidak ditemukan" }, { status: 404 });
    }

    // Delete all related data in correct order to avoid FK constraint issues
    // (Restrict relations: Presensi→Jadwal, Siswa→Kelas, Invite→User)
    await prisma.$transaction(async (tx) => {
      // 1. Delete notifikasi (depends on presensi, siswa)
      await tx.notifikasi.deleteMany({ where: { tenant_id: id } });
      // 2. Delete presensi (depends on jadwal via Restrict, siswa via Cascade)
      await tx.presensi.deleteMany({ where: { tenant_id: id } });
      // 3. Delete siswa (depends on kelas via Restrict)
      await tx.siswa.deleteMany({ where: { tenant_id: id } });
      // 4. Delete invites (depends on user via Restrict)
      await tx.invite.deleteMany({ where: { tenant_id: id } });
      // 5. Delete audit logs
      await tx.auditLog.deleteMany({ where: { tenant_id: id } });
      // 6. Delete the rest (all cascade from tenant, but explicit for safety)
      await tx.setting.deleteMany({ where: { tenant_id: id } });
      await tx.invoice.deleteMany({ where: { tenant_id: id } });
      await tx.apiKey.deleteMany({ where: { tenant_id: id } });
      await tx.featureQuota.deleteMany({ where: { tenant_id: id } });
      await tx.subscription.deleteMany({ where: { tenant_id: id } });
      await tx.guru.deleteMany({ where: { tenant_id: id } });
      await tx.kelas.deleteMany({ where: { tenant_id: id } });
      await tx.jadwal.deleteMany({ where: { tenant_id: id } });
      await tx.user.deleteMany({ where: { tenant_id: id } });
      // 7. Finally delete the tenant itself
      await tx.tenant.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: `Tenant "${tenant.nama_sekolah}" dan semua data terkait berhasil dihapus.` });
  } catch (e: any) {
    console.error("Delete tenant error:", e);
    return NextResponse.json({ error: e.message || "Gagal menghapus tenant" }, { status: 400 });
  }
}
