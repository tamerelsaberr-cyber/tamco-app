import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, paymentId } = body;
    const PI_API_KEY = process.env.PI_API_KEY;

    if (action === 'approve') {
      const response = await fetch(`https://minepi.com{paymentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Pi API Approve error:', errorData);
        return NextResponse.json({ error: 'Failed to approve payment' }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    if (action === 'complete') {
      const response = await fetch(`https://minepi.com{paymentId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ txid: body.txid })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Pi API Complete error:', errorData);
        return NextResponse.json({ error: 'Failed to complete payment' }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}