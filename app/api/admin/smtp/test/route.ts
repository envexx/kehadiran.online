import { NextResponse } from "next/server";
import { testSmtpConnection } from "@/lib/email";
import type { SmtpConfig } from "@/lib/email";

// POST /api/admin/smtp/test - Test SMTP connection
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const config: SmtpConfig = {
      host: body.host,
      port: body.port || 587,
      username: body.username,
      password: body.password,
      from_email: body.from_email,
      from_name: body.from_name || "Kehadiran",
      encryption: body.encryption || "tls",
    };

    const result = await testSmtpConnection(config);

    if (result.success) {
      return NextResponse.json({ success: true, message: "SMTP connection successful" });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
