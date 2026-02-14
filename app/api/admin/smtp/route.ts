import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const configs = await prisma.smtpConfig.findMany({ orderBy: { created_at: "desc" } });
  return NextResponse.json({ data: configs });
}

export async function POST(request: Request) {
  const body = await request.json();
  const config = await prisma.smtpConfig.create({
    data: {
      name: body.name,
      host: body.host,
      port: body.port || 587,
      username: body.username,
      password: body.password,
      from_email: body.from_email,
      from_name: body.from_name || "Kehadiran",
      encryption: body.encryption || "tls",
      is_active: body.is_active ?? true,
      is_default: body.is_default ?? false,
    },
  });
  return NextResponse.json({ success: true, data: config }, { status: 201 });
}
