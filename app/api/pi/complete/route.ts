import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();
    if (!paymentId || !txid) {
      return NextResponse.json({ error: "paymentId or txid missing" }, { status: 400 })
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    if (!piRes.ok) {
      const errText = await piRes.text();
      console.log("Pi complete error:", errText);
      return NextResponse.json({ error: errText }, { status: 500 })
    }

    const data = await piRes.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}