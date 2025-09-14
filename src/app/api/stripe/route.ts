import { Payment } from "@/lib/payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("stripe-signature") as string;
    const code = await Payment.get().processEvents(payload, signature);
    return new NextResponse(null, { status: code });
  } catch (err) {
    console.error(err);
    return new NextResponse(null, { status: 500 });
  }
}
