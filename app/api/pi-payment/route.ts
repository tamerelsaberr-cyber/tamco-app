import { NextResponse } from "next/server";

// استبدل النص بالأسفل بمفتاح الـ API الخاص بك من منصة مطوري Pi
const PI_API_KEY = "YOUR_PI_API_KEY_HERE"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, txid, action } = body;

    // 1. خيار توثيق الموافقة المبدئية
    if (action === "approve") {
      const response = await fetch(`https://minepi.com{paymentId}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Pi Approve Error:", errorData);
        return NextResponse.json({ error: "فشل توثيق الموافقة مع سيرفر باي" }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "تمت الموافقة بنجاح" });
    }

    // 2. خيار التوثيق الأخير (لاكتمال المعاملة)
    if (action === "complete") {
      const response = await fetch(`https://minepi.com{paymentId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Pi Complete Error:", errorData);
        return NextResponse.json({ error: "فشل التوثيق النهائي مع سيرفر باي" }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "تم التوثيق النهائي واكتمال المعاملة بنجاح" });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "حدث خطأ داخلي في السيرفر" }, { status: 500 });
  }
}