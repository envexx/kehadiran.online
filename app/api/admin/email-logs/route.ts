import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const template = searchParams.get("template") || "";
  const status = searchParams.get("status") || "";
  const skip = (page - 1) * limit;

  const where: any = {};
  if (template) where.template = template;
  if (status) where.status = status;

  const [logs, total, sent, failed, pending] = await Promise.all([
    prisma.emailLog.findMany({ where, skip, take: limit, orderBy: { created_at: "desc" } }),
    prisma.emailLog.count({ where }),
    prisma.emailLog.count({ where: { status: "sent" } }),
    prisma.emailLog.count({ where: { status: "failed" } }),
    prisma.emailLog.count({ where: { status: "pending" } }),
  ]);

  return NextResponse.json({
    data: logs.map((l: any) => ({
      id: l.id,
      to_email: l.to_email,
      subject: l.subject,
      template: l.template,
      status: l.status,
      error: l.error,
      sent_at: l.sent_at,
      created_at: l.created_at,
    })),
    stats: { sent, failed, pending },
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
