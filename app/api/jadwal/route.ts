import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with real Prisma queries
  // Uses index: [tenant_id, is_active]
  const data = [
    { id: "j1", hari: "senin", jam_masuk: "07:00", jam_pulang: "15:00", is_active: true },
    { id: "j2", hari: "selasa", jam_masuk: "07:00", jam_pulang: "15:00", is_active: true },
    { id: "j3", hari: "rabu", jam_masuk: "07:00", jam_pulang: "15:00", is_active: true },
    { id: "j4", hari: "kamis", jam_masuk: "07:00", jam_pulang: "15:00", is_active: true },
    { id: "j5", hari: "jumat", jam_masuk: "07:00", jam_pulang: "11:30", is_active: true },
    { id: "j6", hari: "sabtu", jam_masuk: "07:00", jam_pulang: "12:00", is_active: false },
  ];

  return NextResponse.json({ data });
}
