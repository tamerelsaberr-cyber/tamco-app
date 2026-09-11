import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, paymentId, txid } = body;
    const PI_API_KEY = process.env.PI_API_KEY;

    // 1. التحقق الصحيح من وجود المفتاح السري
    if (!PI_API_KEY) {
      return NextResponse.json({ error: 'المفتاح السري PI_API_KEY غير معرف في خادم فيرسيل' }, { status: 500 });
    }

    if (!paymentId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 2. معالجة طلب الموافقة السريعة (Approve) - الرابط الرسمي الصحيح
    if (action === 'approve') {
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

    // 3. معالجة طلب الاكتمال التوثيقي النهائي (Complete) - الرابط الرسمي الصحيح
    if (action === 'complete') {
      const response = await fetch(`https://minepi.com{paymentId}/approve`, {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}