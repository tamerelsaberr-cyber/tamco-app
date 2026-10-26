import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();
    const apiKey = process.env.PI_API_KEY!;

    if (!paymentId || !txid) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Pi complete failed:", data);
      return NextResponse.json(data, { status: res.status });
    }

    // هنا تقدر تحفظ الطلب في الداتابيز بعد كده
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Complete error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
