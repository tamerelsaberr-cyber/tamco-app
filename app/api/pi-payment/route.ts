import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// جلب مفتاح التطبيق السري من إعدادات البيئة في Vercel
const PI_API_KEY = process.env.PI_API_KEY; 
// رابط خوادم Pi Network الافتراضي
const PI_API_URL = "https://minepi.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, action } = body;

    if (!paymentId) {
      return NextResponse.json({ success: false, error: "Missing paymentId" }, { status: 400 });
    }

    // 1. مرحلة الموافقة (Approval) - لحل مشكلة انتهاء الصلاحية
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
        console.error("فشل إرسال الموافقة لـ Pi:", errData);
        return NextResponse.json({ success: false, error: "Pi Server Approval Failed" }, { status: 500 });
      }

      const piResult = await response.json();
      return NextResponse.json({ success: true, message: "Approved successfully", data: piResult }, { status: 200 });
    }

    // 2. مرحلة الإتمام النهائي (Completion) بعد نجاح العملية على البلوكشين
    if (action === "complete") {
      const response = await fetch(`${PI_API_URL}/payments/${paymentId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid: body.txid })
      });

      if (!response.ok) {
        return NextResponse.json({ success: false, error: "Pi Server Completion Failed" }, { status: 500 });
      }

      const piResult = await response.json();
      return NextResponse.json({ success: true, message: "Payment Completed", data: piResult }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}