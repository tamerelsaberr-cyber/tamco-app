
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json();
    const apiKey = process.env.PI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing PI_API_KEY' }, { status: 500 });
    }

    // 1. الموافقة على الدفع وتوثيقه (Approve)
    const approveResponse = await fetch(`https://minepi.com{paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!approveResponse.ok) {
      throw new Error('Failed to approve payment');
    }

    // 2. تأكيد اكتمال الدفع وإغلاق المعاملة (Complete)
    const completeResponse = await fetch(`https://minepi.com{paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    if (!completeResponse.ok) {
      throw new Error('Failed to complete payment');
    }

    const data = await completeResponse.json();
    return NextResponse.json({ success: true, message: "Payment verified successfully", data });

  } catch (error: any) {
    console.error("Pi Payment Error:", error.message);
    return NextResponse.json({ error: 'Payment verification failed', details: error.message }, { status: 500 });
  }
}