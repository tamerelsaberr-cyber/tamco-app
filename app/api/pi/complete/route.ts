import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();

    if (!paymentId || !txid) {
      return NextResponse.json({ error: "Missing paymentId or txid" }, { status: 400 });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing PI_API_KEY in env" }, { status: 500 });
    }

    // تأكيد الدفع مع Pi Servers
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const data = await piRes.json();

    if (!piRes.ok) {
      console.error("Pi complete error:", data);
      return NextResponse.json({ error: data }, { status: 400 });
    }

    // هنا تقدر تحفظ في قاعدة البيانات ان الدفع تم
    // await db.payment.update({ where: { id: paymentId }, data: { status: "completed", txid } })

    return NextResponse.json({ success: true, data });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}