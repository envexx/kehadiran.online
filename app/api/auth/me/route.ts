import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTenantAuth, getAuthPayload } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthPayload();

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.sub },
      select: {
        id: true,
        username: true,
        email: true,
        nama_lengkap: true,
        nomor_telepon: true,
        foto: true,
        role: true,
        tenant_id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let tenant = null;
    if (user.tenant_id) {
      tenant = await prisma.tenant.findUnique({
        where: { id: user.tenant_id },
        select: {
          id: true,
          nama_sekolah: true,
          slug: true,
          alamat: true,
          nomor_telepon: true,
          email: true,
          logo: true,
          qr_mode: true,
        },
      });
    }

    return NextResponse.json({ user, tenant });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
