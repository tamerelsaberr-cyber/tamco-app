
'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        // تهيئة الـ SDK (تأكد من تحويل sandbox إلى false عند النشر الفعلي)
        window.Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi Sandbox initialized");

        // دالة معالجة المدفوعات المعلقة التي لم تكتمل
        const onIncompletePaymentFound = (payment: any) => {
          console.log("Incomplete payment found:", payment);
          // هنا يمكنك إرسال السجل للسيرفر إذا لزم الأمر
        };

        // بدء عملية التوثيق الفوري للمستخدم بمجرد دخول الصفحة
        window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound)
          .then((auth: any) => {
            console.log("Auth success:", auth.user);
            setStatus(`مرحباً بك: ${auth.user.username}`);
          })
          .catch((err: any) => {
            console.error("Auth error:", err);
            setStatus("فشل توثيق الحساب، يرجى فتح الصفحة من تطبيق Pi Browser");
          });

      } catch (err) {
        console.error("Init error:", err);
      }
    }
  }, []);

  const handlePiPayment = async () => {
    if (typeof window === 'undefined' || !window.Pi) {
      setStatus("يرجى فتح التطبيق من داخل محفظة أو متصفح Pi Browser!");
      return;
    }

    setLoading(true);
    setStatus('جاري الاتصال بمحفظة Pi...');

    try {
      await window.Pi.createPayment({
        amount: 1, // المبلغ المطلوب بالـ Pi
        memo: "توثيق وتفعيل حساب تطبيق Tamco Clean",
        metadata: { id: "user_verification_pi" },
      }, {
        // 1. مرحلة الموافقة من السيرفر الخاص بك
        onReadyForServerApproval: async (paymentId: string) => {
          setStatus('جاري إرسال الموافقة التلقائية للمطور...');
          try {
            const response = await fetch('/api/pi-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, action: 'approve' }),
            });

            if (!response.ok) throw new Error('Failed server approval');
            setStatus('تمت موافقة السيرفر. جاري تأكيد الدفع من محفظتك...');
          } catch (error) {
            console.error("Approval error:", error);
            setStatus('فشل تأكيد الدفع من السيرفر الداخلي');
            setLoading(false);
          }
        },
        // 2. مرحلة إتمام المعاملة بعد تسجيلها على البلوكشين
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus('جاري التفعيل والتوثيق بنجاح! جاري التحديث...');
          try {
            const response = await fetch('/api/pi-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid, action: 'complete' }),
            });

            if (!response.ok) throw new Error('Failed completion');
            setStatus('مبروك! اكتملت المعاملة بنجاح وتفعيل التوثيق لـ تامكو');
            
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            console.error("Completion error:", error);
            setStatus('حدث خطأ أثناء الخطوة الأخيرة للتأكيد');
            setLoading(false);
          }
        },
        // 3. حالة إلغاء المستخدم للدفع
        onCancel: (paymentId: string) => {
          console.log("Payment canceled:", paymentId);
          setStatus('تم إلغاء عملية الدفع قبل التأكيد');
          setLoading(false);
        },
        // 4. في حال حدوث خطأ من الـ SDK أو المحفظة
        onError: (error: any, payment: string) => {
          console.error("Payment error:", error, payment);
          setStatus('حدث خطأ أثناء معالجة المحفظة، يرجى المحاولة لاحقاً');
          setLoading(false);
        }
      });
    } catch (err) {
      console.error("Payment trigger error:", err);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>Tamco Clean توثيق وتفعيل حساب</h1>
        
        {status && (
          <p style={{ fontSize: '18px', color: '#655A43', marginBottom: '20px' }}>
            {status}
          </p>
        )}

      <button 
  onClick={handlePiPayment} 
  disabled={loading}
  style={{
    backgroundColor: loading ? '#aaaaaa' : '#8a2be2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    width: '100%',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}
>
  {loading ? "...جاري معالجة الدفع والتوثيق" : "اضغط هنا للدفع وتفعيل التوثيق 10"}
</button> 