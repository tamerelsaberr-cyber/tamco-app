import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// جلب مفتاح التطبيق السري الآمن
const PI_API_KEY = process.env.PI_API_KEY;
// رابط خوادم Pi Network الافتراضي المحدث
const PI_API_URL = "https://minepi.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // جلب كافة البيانات المرسلة من الواجهة الأمامية بما فيها معرف المعاملة txid
    const { paymentId, action, txid } = body;

    if (!paymentId) {
      return NextResponse.json({ success: false, error: "Missing paymentId" }, { status: 400 });
    }

    if (!PI_API_KEY) {
      return NextResponse.json({ success: false, error: "Server configuration error: Missing PI_API_KEY" }, { status: 500 });
    }

    // 1. مرحلة الموافقة الثنائية (Server Approval)
    if (action === "approve") {
      const response = await fetch(`${PI_API_URL}/payments/${paymentId}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Pi Server Approval Failed:", errData);
        return NextResponse.json({ success: false, error: "Pi Server rejected approval" }, { status: response.status });
      }

      const piResult = await response.json();
      return NextResponse.json({ success: true, message: "Payment approved successfully", data: piResult });
    }

    // 2. مرحلة الإتمام النهائي على البلوكشين (Server Completion)
    if (action === "complete") {
      if (!txid) {
        return NextResponse.json({ success: false, error: "Missing txid for completion" }, { status: 400 });
      }

      const response = await fetch(`${PI_API_URL}/payments/${paymentId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid: txid })
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Pi Server Completion Failed:", errData);
        return NextResponse.json({ success: false, error: "Pi Server rejected completion" }, { status: response.status });
      }

      const piResult = await response.json();
      return NextResponse.json({ success: true, message: "Payment completed on blockchain", data: piResult });
    }

    return NextResponse.json({ success: false, error: "Invalid action specified" }, { status: 400 });

  } catch (error) {
    console.error("Error processing Pi payment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}