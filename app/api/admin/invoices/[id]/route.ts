import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const inv = await prisma.invoice.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.paid_at && { paid_at: new Date(body.paid_at) }),
        ...(body.payment_method && { payment_method: body.payment_method }),
      },
    });
    return NextResponse.json({ success: true, data: inv });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
