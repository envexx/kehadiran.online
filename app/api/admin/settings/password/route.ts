import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
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
    const { old_password, new_password } = body;

    if (!old_password || !new_password) {
      return NextResponse.json({ error: "Password lama dan baru wajib diisi" }, { status: 400 });
    }

    if (new_password.length < 8) {
      return NextResponse.json({ error: "Password baru minimal 8 karakter" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const valid = await bcrypt.compare(old_password, user.password_hash);
    if (!valid) return NextResponse.json({ error: "Password lama salah" }, { status: 400 });

    const newHash = await bcrypt.hash(new_password, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
