import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const config = await prisma.smtpConfig.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.host && { host: body.host }),
        ...(body.port !== undefined && { port: body.port }),
        ...(body.username && { username: body.username }),
        ...(body.password && { password: body.password }),
        ...(body.from_email && { from_email: body.from_email }),
        ...(body.from_name && { from_name: body.from_name }),
        ...(body.encryption && { encryption: body.encryption }),
        ...(body.is_active !== undefined && { is_active: body.is_active }),
        ...(body.is_default !== undefined && { is_default: body.is_default }),
      },
    });
    return NextResponse.json({ success: true, data: config });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.smtpConfig.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
