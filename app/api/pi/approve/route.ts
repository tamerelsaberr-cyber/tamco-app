import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId missing" }, { status: 400 });
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });
    }

    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!piRes.ok) {
      const errText = await piRes.text();
      console.log("Pi approve error:", errText);
      return NextResponse.json({ error: errText }, { status: 400 });
    }

    const data = await piRes.json();
    return NextResponse.json(data);

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}