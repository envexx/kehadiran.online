import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "kehadiran-super-secret-key-change-in-production";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    // Find superadmin user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: "Akun dinonaktifkan" }, { status: 403 });
    }

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Update last_login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    // Create JWT token using jose (Edge-compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama: user.nama_lengkap,
      },
    });

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
