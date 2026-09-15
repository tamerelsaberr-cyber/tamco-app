'use client';

import React, { useState, useEffect } from 'react';

// ترويض TypeScript لتجنب مشاكل فحص الأنواع مع نافذة المتصفح
declare global {
  interface Window {
    Pi: any;
  }
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // تهيئة التطبيق بمجرد التأكد من تحميل المكتبة داخل متصفح Pi Browser
  useEffect(() => {
    const initPi = () => {
      if (typeof window !== 'undefined' && window.Pi) {
        try {
          // تهيئة الـ Sandbox في وضع التجربة للـ Testnet
          window.Pi.init({ version: "2.0", sandbox: true });
          console.log("تمت تهيئة بيئة Pi Sandbox بنجاح");

          // تفعيل المصادقة التلقائية للحصول على اسم المستخدم وتصريح المدفوعات المعلقة
          window.Pi.authenticate(['username', 'payments'], (incompletePayment: any) => {
            console.log("تم العثور على معاملة معلقة:", incompletePayment);
            // هنا يمكنك إرسال المعاملة المعلقة لسيرفرك لمعالجتها إن وجدت
          }).catch((err: any) => {
            console.error("خطأ في المصادقة التلقائية لـ Pi:", err);
          });
        } catch (err) {
          console.error("خطأ أثناء تهيئة الحزمة:", err);
        }
      }
    };

    // تشغيل التهيئة فوراً
    initPi();
  }, []);

 
    }

    setLoading(true);
    setStatus('جاري الاتصال بمحفظة Pi...');

    try {
      await window.Pi.createPayment({
        amount: 1,
        memo: "Tamco Clean توثيق وتفعيل حساب تطبيق",
        metadata: { id: "user_verification_pi" },
      }, {
        // مرحلة موافقة السيرفر المطور الداخلي .1
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
            setStatus('فشلت تأكيد الدفع من السيرفر الداخلي');
            setLoading(false);
          }
        },

        // مرحلة إتمام وتوثيق العملية بعد خصم العملة من البلوكشين .2
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus('جاري التفعيل والتوثيق بنجاح! جاري التحديث...');
          try {
            const response = await fetch('/api/pi-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid, action: 'complete' }),
            });

            if (!response.ok) throw new Error('فشلت إتمام العملية بالسيرفر');
            
            setLoading(false);
            setStatus('مبروك! اكتملت المعاملة بنجاح وتفعل التوثيق لـ تامكو');
            
            // إعادة تحميل الصفحة بعد ثانيتين لتحديث حالة التطبيق
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            console.error("Completion error:", error);
            setStatus('حدث خطأ أثناء الخطوة الأخيرة للتأكيد');
            setLoading(false);
          }
        },

        // في حال إلغاء الدفع من قبل المستخدم .3
        onCancel: (paymentId: string) => {
          setStatus('تم إلغاء عملية الدفع قبل التأكيد');
          setLoading(false);
          console.log("Payment cancelled:", paymentId);
        },

        // في حال حدوث أي خطأ مفاجئ بالشبكة .4
        onError: (error: any, paymentId?: string) => {
          setStatus('حدث خطأ أثناء معالجة المحفظة، يرجى المحاولة لاحقاً');
          setLoading(false);
          console.error("Pi SDK Error:", error, "Payment ID:", paymentId);
        },
      });
    } catch (err) {
      console.error("Payment trigger error:", err);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center' }}>
        <h1 style={{ color: '#05b21b', fontSize: '28px', marginBottom: '20px' }}>تطبيق تامكو Clean</h1>
        
        {status && (
          <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '20px' }}>
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