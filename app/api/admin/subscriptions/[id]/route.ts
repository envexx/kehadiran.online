import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const sub = await prisma.subscription.update({
      where: { id },
      data: {
        ...(body.plan && { plan: body.plan }),
        ...(body.status && { status: body.status }),
        ...(body.billing_cycle && { billing_cycle: body.billing_cycle }),
        ...(body.amount !== undefined && { amount: body.amount }),
        ...(body.ended_at && { ended_at: new Date(body.ended_at) }),
      },
    });
    return NextResponse.json({ success: true, data: sub });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.subscription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
