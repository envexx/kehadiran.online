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
      { nama_sekolah: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        subscription: { select: { plan: true, status: true } },
        _count: { select: { siswa: true, users: true, gurus: true } },
      },
    }),
    prisma.tenant.count({ where }),
  ]);

  return NextResponse.json({
    data: tenants.map((t: any) => ({
      id: t.id,
      nama: t.nama_sekolah,
      slug: t.slug,
      email: t.email,
      alamat: t.alamat,
      nomor_telepon: t.nomor_telepon,
      is_active: t.is_active,
      plan: t.subscription?.plan || "free",
      status: t.subscription?.status || "inactive",
      siswa: t._count.siswa,
      guru: t._count.gurus,
      users: t._count.users,
      created_at: t.created_at,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

