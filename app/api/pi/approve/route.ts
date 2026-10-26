import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { paymentId } = await req.json();
  const apiKey = process.env.PI_API_KEY!;

  const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: "POST",
    headers: { Authorization: `Key ${apiKey}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}