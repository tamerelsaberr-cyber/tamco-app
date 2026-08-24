import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { paymentId } = await request.json();

        if (!paymentId) {
            return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
        }

        const PI_API_KEY = process.env.PI_API_KEY; 

        const response = await fetch(`https://minepi.com{paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Pi API error:', errorData);
            return NextResponse.json({ error: 'Failed to approve payment with Pi Network' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}