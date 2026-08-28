import { NextResponse } from 'next/server';

// 1. السماح بالحماية والمرور (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Hex-Nonce',
    },
  });
}

// 2. معالجة الموافقة والإتمام لشبكة باى
export async function POST(request) {
  try {
    const body = await request.json();
    const paymentId = body.paymentId;
    const txid = body.txid;
    const apiKey = process.env.PI_API_KEY;

    // خطوة الإتمام النهائية (Complete) إذا أرسل التطبيق التوكين
    if (txid) {
      await fetch("https://minepi.com" + paymentId + "/complete", {
        method: 'POST',
        headers: { 
          'Authorization': "Key " + apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ txid: txid })
      });

      return new NextResponse(JSON.stringify({ message: "Completed" }), {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // خطوة الموافقة الأولى (Approve)
    await fetch("https://minepi.com" + paymentId + "/approve", {
      method: 'POST',
      headers: { 'Authorization': "Key " + apiKey }
    });

    return new NextResponse(JSON.stringify({ message: "Approved" }), {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
