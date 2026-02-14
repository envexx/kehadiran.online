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
    await prisma.tenant.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
