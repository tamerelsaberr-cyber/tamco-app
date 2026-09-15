import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, paymentId, txid } = body;
    const PI_API_KEY = process.env.PI_API_KEY;

    // 1. التحقق من وجود المفتاح السري للمطور في السيرفر
    if (!PI_API_KEY) {
      console.error("خطأ: لم يتم العثور على مفتاح PI_API_KEY في ملف الـ .env");
      return NextResponse.json({ error: 'المفتاح السري للمطور غير معرف في السيرفر' }, { status: 500 });
    }

    if (!paymentId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 2. معالجة طلب الموافقة السريعة (Approve)
    if (action === 'approve') {
      console.log(`جاري إرسال الموافقة لعملية الدفع: ${paymentId}`);
      
      const response = await fetch(`https://minepi.com{paymentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Pi API Approve error:', errorData);
        return NextResponse.json({ error: 'Failed to approve payment', details: errorData }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    // 3. معالجة طلب الاكتمال التوثيقي النهائي (Complete)
    if (action === 'complete') {
      if (!txid) {
        return NextResponse.json({ error: 'Missing txid for completion' }, { status: 400 });
      }

      console.log(`جاري إتمام عملية الدفع: ${paymentId} مع معرف المعاملة: ${txid}`);

      const response = await fetch(`https://minepi.com{paymentId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txid }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Pi API Complete error:', errorData);
        return NextResponse.json({ error: 'Failed to complete payment', details: errorData }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Server error (pi-payment):', error);
    return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 });
  }
}