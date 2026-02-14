import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const action = searchParams.get("action") || "";
  const entity = searchParams.get("entity") || "";
  const skip = (page - 1) * limit;

  const where: any = {};
  if (action) where.action = action;
  if (entity) where.entity_type = entity;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: { user: { select: { nama_lengkap: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return NextResponse.json({
    data: logs.map((l: any) => ({
      id: l.id,
      user: l.user?.nama_lengkap || "System",
      user_email: l.user?.email || null,
      action: l.action,
      entity_type: l.entity_type,
      entity_id: l.entity_id,
      changes: l.changes,
      ip_address: l.ip_address,
      created_at: l.created_at,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
