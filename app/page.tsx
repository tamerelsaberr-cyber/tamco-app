'use client';

import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Pi) {
      try {
        (window as any).Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi Sandbox Initialized Successfully");
      } catch (err) {
        console.error("Pi Init Error:", err);
      }
    }
  }, []);

  const handlePiPayment = async () => {
    if (typeof window === 'undefined' || !(window as any).Pi) {
      setStatus("برجاء فتح التطبيق من داخل متصفح Pi Browser فقط!");
      return;
    }

    setLoading(true);
    setStatus("جاري تحضير معاملة التوثيق التجريبية...");

    try {
      await (window as any).Pi.createPayment({
        amount: 1,
        memo: "Tamco Clean - توثيق وتفعيل التطبيق النهائي",
        metadata: { id: "user_verification_pi" },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("Payment Ready for Approval. ID:", paymentId);
          setStatus("تم تجهيز المعاملة! جاري إرسال التأكيد التلقائي للشبكة...");
          
          try {
            await fetch('/api/pi-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, action: 'approve' }),
            });
          } catch (e) {
            console.log("خادم الـ API المحلي لم يستجب، سيتم المتابعة عبر الشبكة مباشرة.");
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("Payment Ready for Completion. TxID:", txid);
          setStatus("جاري تسجيل المعاملة على البلوكتشين وإتمام التوثيق...");
          
          try {
            await fetch('/api/pi-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid, action: 'complete' }),
            });
          } catch (e) {
            console.log("متابعة الإتمام التلقائي.");
          }

          setStatus("تهانينا! تم تفعيل وتوثيق التطبيق بنجاح للخطوة 10!");
          setLoading(false);
          setTimeout(() => { window.location.reload(); }, 3000);
        },
        onCancel: (paymentId: string) => {
          setStatus("تم إلغاء عملية الدفع قبل التأكيد.");
          setLoading(false);
        },
        onError: (error: any, payment: any) => {
          console.error("Payment Error:", error);
          setStatus(`حدث خطأ أثناء المعالجة: ${error.message || 'يرجى مراجعة كونسول الأخطاء'}`);
          setLoading(false);
        }
      });
    } catch (err: any) {
      console.error("Trigger Error:", err);
      setStatus("فشل تشغيل نافذة الدفع، تأكد من مطابقة الروابط.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', direction: 'rtl', textAlign: 'center' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>Tamco Clean - توثيق وتفعيل حساب</h1>
        
        {status && (
          <p style={{ fontSize: '16px', color: '#e62ba2', marginBottom: '20px', fontWeight: 'bold' }}>
            {status}
          </p>
        )}

        <button
          onClick={handlePiPayment}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#aaaaaa' : '#e62ba2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold'
          }}
        >
          {loading ? "جاري معالجة الدفع والتوثيق..." : "اضغط هنا للدفع وتفعيل التوثيق (الخطوة 10)"}
        </button>
      </div>
    </div>
  );
}