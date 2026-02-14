import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const updateData: any = {};
    if (body.nama_lengkap) updateData.nama_lengkap = body.nama_lengkap;
    if (body.email) updateData.email = body.email;
    if (body.username) updateData.username = body.username;
    if (body.role) updateData.role = body.role;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.password) updateData.password_hash = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, data: { id: user.id, email: user.email } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
