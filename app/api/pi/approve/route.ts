import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    const apiKey = process.env.PI_API_KEY!;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ error: "Missing PI_API_KEY env" }, { status: 500 });
    }

    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Pi approve failed:", data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Approve error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}