'use client';
import React, { useState, useEffect } from 'react';

// ترويض TypeScript لكي يتقبل وجود Pi في نافذة المتصفح بدون أخطاء
declare global {
  interface Window {
    Pi: any;
  }
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // خطوة سحرية: تهيئة وتحميل حزمة Pi فور تصفح التطبيق من داخل Pi Browser
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://minepi.com';
    script.async = true;
    
    script.onload = () => {
      if (window.Pi) {
        try {
          // تهيئة الحزمة في وضع التجربة Sandbox لشبكة التست نت
          window.Pi.init({ version: "2.0", sandbox: true });
          console.log("حزمة Pi جاهزة للعمل في وضع التجربة Sandbox");
          
          // تفعيل المصادقة التلقائية للحصول على اسم المستخدم وتصريح المدفوعات أولاً
          window.Pi.authenticate(['username', 'payments'], (incompletePayment: any) => {
            console.log("تم العثور على معاملة معلقة:", incompletePayment);
            // هنا يمكنك إرسال المعاملة المعلقة لسيرفرك لتصفيتها إن وجدت
          }).catch((err: any) => {
            console.error("خطأ في المصادقة التلقائية لـ Pi:", err);
          });

        } catch (err) {
          console.error("خطأ أثناء تهيئة حزمة Pi:", err);
        }
      }
    };
    document.head.appendChild(script);
  }, []);

  // دالة بدء عملية الدفع والتوثيق المباشرة (تم إصلاح الأخطاء البرمجية وإلغاء await)
  const handlePiPayment = () => {
    if (!window.Pi) {
      alert("الرسمي لضمان عمل المحفظة Pi Browser يرجى فتح الموقع من داخل متصفح");
      return;
    }

    setLoading(true);
    setStatus('Pi... جاري الاتصال بمحفظة');

    window.Pi.createPayment({
      amount: 1, 
      memo: "توثيق وتفعيل حساب تطبيق Tamco Clean",
      metadata: { id: "user_verification_pi" },
    }, {
      // 1. مرحلة موافقة السيرفر المطور الداخلي
      onReadyForServerApproval: async (paymentId: string) => {
        setStatus('جاري إرسال الموافقة التلقائية للمطور...');
        try {
          const response = await fetch('/api/pi-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, action: 'approve' }),
          });
          
          if (!response.ok) throw new Error('فشلت موافقة السيرفر الداخلي');
          
          setStatus('تمت موافقة السيرفر، جاري تأكيد الدفع من محفظتك...');
        } catch (error) {
          console.error("Approval error:", error);
          setStatus('فشل تأكيد الدفع من السيرفر الداخلي');
          setLoading(false);
        }
      },
      // 2. مرحلة إتمام وتوثيق العملية بعد خصم العملة من البلوكتشين
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        setStatus('جاري التفعيل والتوثيق بنجاح! جاري التحديث...');
        try {
          const response = await fetch('/api/pi-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid, action: 'complete' }),
          });

          if (!response.ok) throw new Error('فشل إتمام العملية بالسيرفر');
          
          setLoading(false);
          setStatus('مبروك! اكتملت المعاملة بنجاح وتفعل التوثيق لـ تامكو.');
          // إعادة تحميل الصفحة بعد ثانيتين لتحديث حالة التطبيق
          setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
          console.error("Completion error:", error);
          setStatus('حدث خطأ أثناء الخطوة الأخيرة للتأكيد');
          setLoading(false);
        }
      },
      // 3. في حال إلغاء الدفع من قبل المستخدم
      onCancel: (paymentId: string) => {
        setStatus('تم إلغاء عملية الدفع من قبل المستخدم قبل التأكيد');
        setLoading(false);
        console.log("Payment cancelled:", paymentId);
      },
      // 4. في حال حدوث أي خطأ مفاجئ بالشبكة
      onError: (error: any, paymentId?: string) => {
        setStatus('حدث خطأ أثناء معالجة المحفظة، يرجى المحاولة لاحقاً');
        setLoading(false);
        console.error("Pi SDK Error:", error, "Payment ID:", paymentId);
      },
    });
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center' }}>
        <h1 style={{ color: '#05b21b', fontSize: '28px', marginBottom: '20px' }}>تطبيق تامكو Clean</h1>
        
        {status && (
          <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '20px', fontWeight: '500' }}>
            {status}
          </p>
        )}
        
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
            transition: '0.3s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? 'جاري معالجة التوثيق التلقائي...' : 'اضغط هنا لإجراء دفع تجريبي (1 Pi)'}
        </button>
      </div>
    </div>
  );
}