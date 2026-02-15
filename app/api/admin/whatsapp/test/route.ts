import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdminAuth } from "@/lib/auth";
import { sendWhatsApp } from "@/lib/whatsapp";

async function requireSuperAdmin() {
  const { userId } = await requireSuperAdminAuth();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "superadmin") throw new Error("FORBIDDEN");
  return { userId };
}

export async function POST(request: Request) {
  try {
    await requireSuperAdmin();
    const { number } = await request.json();

    if (!number) {
      return NextResponse.json({ error: "Nomor tujuan wajib diisi" }, { status: 400 });
    }

    // Get WA config from GlobalSetting
    const settings = await prisma.globalSetting.findMany({
      where: { category: "whatsapp" },
    });

    const token = settings.find((s) => s.key === "wa_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "API Token belum dikonfigurasi. Simpan konfigurasi terlebih dahulu." },
        { status: 400 }
      );
    }

    const result = await sendWhatsApp(
      {
        target: number,
        message:
          "✅ *Test Pesan dari Kehadiran*\n\nKonfigurasi WhatsApp API berhasil!\nPesan ini dikirim dari panel Super Admin.\n\n— Kehadiran Platform",
      },
      token
    );

    if (result.success) {
      return NextResponse.json({ success: true, message: "Pesan test berhasil terkirim!" });
    } else {
      return NextResponse.json({ error: result.error || "Gagal mengirim pesan" }, { status: 400 });
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof Error && e.message === "FORBIDDEN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("WhatsApp test error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
