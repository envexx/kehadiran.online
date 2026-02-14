import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { created_at: "asc" },
  });

  return NextResponse.json({ data: templates });
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const template = await prisma.emailTemplate.create({
      data: {
        key: body.key,
        name: body.name,
        description: body.description || null,
        subject: body.subject,
        body_html: body.body_html,
        variables: body.variables || null,
        is_active: body.is_active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Template key sudah digunakan" }, { status: 400 });
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
