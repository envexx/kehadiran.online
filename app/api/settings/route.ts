import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";

  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, category]
  const allSettings = [
    { key: "school_name", value: "SMK Negeri 1 Batam", category: "general" },
    { key: "school_address", value: "Jl. Prof. Dr. Hamka No. 1, Batam", category: "general" },
    { key: "school_phone", value: "0778-123456", category: "general" },
    { key: "school_email", value: "info@smkn1batam.sch.id", category: "general" },
    { key: "wa_api_url", value: "https://api.fonnte.com/send", category: "whatsapp" },
    { key: "wa_api_token", value: "••••••••", category: "whatsapp" },
    { key: "wa_template_hadir", value: "Yth. Bapak/Ibu, {nama_siswa} telah hadir di sekolah pada {waktu}.", category: "whatsapp" },
    { key: "wa_template_alpha", value: "Yth. Bapak/Ibu, {nama_siswa} tidak hadir di sekolah hari ini.", category: "whatsapp" },
    { key: "presensi_batas_terlambat", value: "15", category: "presensi" },
    { key: "presensi_auto_alpha", value: "true", category: "presensi" },
  ];

  const data = category ? allSettings.filter((s) => s.category === category) : allSettings;

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}
