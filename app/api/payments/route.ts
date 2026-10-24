import { NextResponse } from 'next/server';

// 1. CORS Headers لمزامنة متصفح باي بالسيرفر الخلفي
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

// الدالة الرئيسية لمعالجة مدفوعات شبكة باي
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, txid, action, amount, memo, uid } = body;
    const apiKey = process.env.PI_API_KEY;

    if (!apiKey) {
      return new NextResponse(JSON.stringify({ error: 'PI_API_KEY is missing on Vercel environment' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const headers = {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
    };

    // أ) خطوة إنشاء الدفع الأولي 
    if (!action && amount) {
      const response = await fetch('https://minepi.com', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          payment: {
            amount: amount,
            memo: memo || 'Tamco Payment',
            metadata: { internalId: 'verification_step_10' },
            uid: uid || 'test-user-uid' // يقبل الـ uid الديناميكي القادم من المتصفح
          }
        })
      });

      const data = await response.json();
      
      return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // ب) خطوة الموافقة الرسمية (Approve)
    if (action === 'approve') {
      const response = await fetch(`https://minepi.com/${paymentId}/approve`, {
        method: 'POST',
        headers: headers,
      });

      const data = await response.json();
      return new NextResponse(JSON.stringify({ message: 'Payment approved successfully', data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // ج) خطوة الإكمال والبحث على البلوكتشين (Complete)
    if (action === 'complete') {
      const response = await fetch(`https://minepi.com/${paymentId}/complete`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ txid }),
      });

      const data = await response.json();
      return new NextResponse(JSON.stringify({ message: 'Payment completed successfully', data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new NextResponse(JSON.stringify({ error: 'Invalid action specified' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}