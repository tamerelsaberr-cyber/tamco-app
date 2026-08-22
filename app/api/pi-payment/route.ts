import { NextResponse } from "next/server";

// ⚠️ قمت بنسخ مفتاح الأمان الخاص بك من صورتك السابقة ليكون جاهزاً ومفعلاً فوراً
const PI_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey3pZ"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, txid, action } = body;

    // 1️⃣ أولاً: توثيق الموافقة المبدئية (Approve)
    if (action === "approve") {
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Pi Approve Error:", errorData);
        return NextResponse.json({ error: "فشل توثيق الموافقة" }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "تمت الموافقة بنجاح" });
    }

    // 2️⃣ ثانياً: التوثيق النهائي والإكمال (Complete)
    if (action === "complete") {
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Pi Complete Error:", errorData);
        return NextResponse.json({ error: "فشل التوثيق النهائي" }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "تم التوثيق النهائي واكتمال المعاملة" });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "حدث خطأ داخلي في السيرفر" }, { status: 500 });
  }
}