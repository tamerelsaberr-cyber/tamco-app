import { NextResponse } from 'next/server';

// 1. CORS Headers لتأمين اتصال المتصفح بالسيرفر
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// 2. الدالة الرئيسية لمعالجة مدفوعات شبكة Pi
export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentId, txid, action } = body;
    const apiKey = process.env.PI_API_KEY;

    if (!apiKey) {
      return new NextResponse(JSON.stringify({ error: 'PI_API_KEY is missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const headers = {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
    };

    // خطوة الموافقة الرسمية (Approve)
    if (action === 'approve') {
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: headers,
      });

      const data = await response.json();
      return new NextResponse(JSON.stringify({ message: 'Payment approved successfully', data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // خطوة الإكمال والبث على البلوكشين (Complete)
    if (action === 'complete') {
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ txid }),
      });

      const data = await response.json();
      return new NextResponse(JSON.stringify({ message: 'Payment completed successfully', data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new NextResponse(JSON.stringify({ error: 'Invalid action specified' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}