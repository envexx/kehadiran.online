import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-in-production");

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const body = await request.json();
    const { nama, email } = body;

    if (!nama || !email) {
      return NextResponse.json({ error: "Nama dan email wajib diisi" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        nama_lengkap: nama,
        email: email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
    }
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
