'use client';
import React, { useState, useEffect } from 'react';

// ترويض نظام TypeScript لكي يقبل وجود Pi في نافذة المتصفح بدون أخطاء فيرسل
declare global {
  interface Window {
    Pi: any;
  }
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // خطوة سحرية: تهيئة حزمة Pi فور تصفح التطبيق من داخل Pi Browser
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        window.Pi.init({ version: "2.0", sandbox: true });
        console.log("حزمة Pi جاهزة للعمل في وضع التجربة");
      } catch (err) {
        console.error("خطأ أثناء تهيئة حزمة Pi:", err);
      }
    }
  }, []);

  const handlePiPayment = async () => {
    
    setLoading(true);
    setStatus('جاري الاتصال بمحفظة Pi...');

    try {
      const Pi = window.Pi;

      // تفعيل المصادقة للحصول على اسم المستخدم وتصريح المدفوعات أولاً
      const auth = await Pi.authenticate(['username', 'payments'], (incompletePayment: any) => {
        console.log("تم العثور على معاملة معلقة:", incompletePayment);
        // هنا يمكنك إرسال المعاملة المعلقة لسيرفرك لتصفيتها إن وجدت
      });

      // بدء عملية الدفع والتوثيق المباشرة
      const payment = await Pi.createPayment({
        amount: 1,
        memo: "Tamco Clean توثيق وتفعيل حساب تطبيق",
        metadata: { id: "user_verification_pi" },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          setStatus('جاري إرسال الموافقة التلقائية للمطور...');
          try {
            const response = await fetch('/api/pi-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, action: 'approve' }),
            });
            if (!response.ok) throw new Error('فشلت موافقة السيرفر الداخلي');
            return paymentId;
          } catch (error) {
            console.error("Approval error:", error);
            setStatus('فشل تأكيد الدفع من السيرفر');
            setLoading(false);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus('جاري التفعيل والتوثيق بنجاح! جاري التحديث...');
          try {
            await fetch('/api/pi-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, action: 'complete', txid }),
            });
            window.location.reload();
          } catch (error) {
            console.error("Completion error:", error);
            setLoading(false);
          }
        },
        onCancel: (paymentId: string) => {
          setStatus('تم إلغاء عملية الدفع من قبل المستخدم');
          setLoading(false);
        },
        onError: (error: any, paymentId?: string) => {
          setStatus('حدث خطأ أثناء المعالجة، يرجى المحاولة لاحقاً');
          setLoading(false);
          console.error("Pi SDK Error:", error);
        }
      });

    } catch (err) {
      setStatus('فشلت العملية، يرجى إعادة المحاولة المباشرة');
      setLoading(false);
      console.error("Global Error:", err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center' }}>
        <h1 style={{ color: '#05b21b', fontSize: '28px', marginBottom: '20px' }}>توثيق حساب تامكو</h1>
        {status && <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '20px' }}>{status}</p>}
        
        <button
          onClick={handlePiPayment}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9333ea' : '#04d21b',
            color: '#fff',
            border: 'none',
            padding: '15px 30px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold',
            transition: '0.3s'
          }}
        >
          {loading ? '...جاري معالجة التوثيق' : 'اضغط هنا لإجراء دفع تجريبي'}
        </button>
      </div>
    </div>
  );
}
export function PiPaymentButton() {
  const handlePayment = async () => {
    try {
      if (!window.Pi) {
        alert("يرجى فتح الموقع من داخل متصفح Pi Browser الرسمي لإتمام العملية");
        return;
      }
      
      await window.Pi.createPayment({
        amount: 0.1,
        memo: "Test Transaction",
        metadata: { appId: "tamco7478" }
      }, {
        onReadyForServerApproval: async (paymentId) => {
          await fetch('/api/payments', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId }) 
          });
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          alert("مبروك! اكتملت المعاملة بنجاح وتفعل التوثيق");
        },
        onCancel: () => console.log("Cancelled"),
        onError: (err) => alert("خطأ في الدفع: " + err.message)
      });
    } catch (e) {
      alert("حدث خطأ: " + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '50px 0' }}>
      <button 
        onClick={handlePayment}
        style={{ padding: '15px 30px', backgroundColor: '#eac024', color: '#000', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
      >
        اضغط هنا لتأكيد الدفع التجريبي وتفعيل الخطوة 10
      </button>
    </div>
  );
}
