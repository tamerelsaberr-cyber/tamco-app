'use client'
import { useEffect } from 'react';
declare global { interface Window { Pi: any; } }
export default function PaymentMethodsSection() {
  useEffect(() => {
    const init = () => { if (window.Pi) window.Pi.init({ version: "2.0", sandbox: true }); };
    if (window.Pi) init();
    else {
      const s = document.createElement('script');
      s.src = 'https://sdk.minepi.com/pi-sdk.js';
      s.onload = init;
      document.head.appendChild(s);
    }
  }, []);
  const handlePiPayment = async () => {
    if (!window.Pi) { alert("تنبيه: يرجى فتح الرابط من داخل تطبيق Pi Browser"); return; }
    try {
      const auth: any = await window.Pi.authenticate(["username","payments"], (p:any)=>console.log("Incomplete:",p));
      const res = await fetch("/api/payments", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ uid: auth.user.uid, action:"create" }) });
      const data = await res.json();
      if (!data.identifier) { alert("لم نتمكن من جلب الدفع الجديد: " + (data.error||"")); return; }
      await window.Pi.createPayment({ paymentId: data.identifier }, {
        onReadyForServerApproval: async (pid:string)=>{ await fetch("/api/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId:pid,action:"approve"})}); },
        onReadyForServerCompletion: async (pid:string,txid:string)=>{ await fetch("/api/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId:pid,txid,action:"complete"})}); alert("اتمت عملية الدفع وتوثيق الخطوة بنجاح كامل"); },
        onCancel: ()=>alert("تم إلغاء عملية الدفع"),
        onError: (e:any)=>alert("حدث خطأ أثناء معالجة الدفع: "+e.message)
      });
    } catch(e:any){ alert("فشلت عملية المعادلة: "+e.message); }
  };
  return <button onClick={handlePiPayment} style={{background:"#6f2dbd",color:"#fff",padding:"14px",width:"100%",borderRadius:"10px",fontWeight:"bold",border:"none",cursor:"pointer"}}>Complete Step 10 Verification (1 Pi)</button>;
}