import { NextRequest, NextResponse } from 'next/server';
const KEY = process.env.PI_API_KEY!;
const URL = 'https://api.minepi.com/v2';
async function piApi(ep:string, m:string, b?:any){
  const r = await fetch(URL+ep,{method:m,headers:{Authorization:`Key ${KEY}`,'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});
  return {status:r.status,data:await r.json()};
}
export async function POST(req:NextRequest){
  try{
    const {uid,paymentId,txid,action}=await req.json();
    if(action==='create'){
      const {status,data}=await piApi('/payments','POST',{payment:{amount:1,memo:'Complete Step 10 Verification',metadata:{step:10},uid}});
      return NextResponse.json(data,{status});
    }
    if(action==='approve'){ const {status,data}=await piApi(`/payments/${paymentId}/approve`,'POST'); return NextResponse.json(data,{status}); }
    if(action==='complete'){ const {status,data}=await piApi(`/payments/${paymentId}/complete`,'POST',{txid}); return NextResponse.json(data,{status}); }
    return NextResponse.json({error:'Invalid action'},{status:400});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); }
}