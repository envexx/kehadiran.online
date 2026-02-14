import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "kehadiran-super-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: {
          select: { id: true, nama_sekolah: true, slug: true, is_active: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Check user is active
    if (!user.is_active) {
      return NextResponse.json({ error: "Akun Anda tidak aktif" }, { status: 403 });
    }

    // Check tenant is active (for non-superadmin)
    if (user.role !== "superadmin" && user.tenant && !user.tenant.is_active) {
      return NextResponse.json({ error: "Sekolah Anda tidak aktif. Hubungi administrator." }, { status: 403 });
    }

    // Create JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id || undefined,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    // Update last_login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        nama: user.nama_lengkap,
        role: user.role,
      },
      tenant: user.tenant ? {
        id: user.tenant.id,
        nama: user.tenant.nama_sekolah,
        slug: user.tenant.slug,
      } : null,
    });

    // Set auth cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
