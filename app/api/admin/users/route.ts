import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { nama_lengkap: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: { tenant: { select: { nama_sekolah: true } } },
      omit: { password_hash: true },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    data: users.map((u: any) => ({
      id: u.id,
      nama: u.nama_lengkap,
      email: u.email,
      role: u.role,
      tenant: u.tenant?.nama_sekolah || null,
      is_active: u.is_active,
      last_login: u.last_login,
      created_at: u.created_at,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

