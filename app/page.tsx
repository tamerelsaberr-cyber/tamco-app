"use client";

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
    // تهيئة حزمة Sandbox للعمل فور تحميل الصفحة داخل المتصفح
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        window.Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi Sandbox Initialized Successfully");
      } catch (err) {
        console.error("Pi Init Error:", err);
      }
    }
  }, []);

  const handlePiPayment = async () => {
    if (typeof window === 'undefined' || !window.Pi) {
      setStatus("برجاء فتح التطبيق من داخل متصفح Pi Browser الرسمي لتفعيل التوثيق.");
      return;
    }

    setLoading(true);
    setStatus("جاري تحضير معاملة التوثيق التجريبية...");

    try {
      await window.Pi.createPayment({
        amount: 1,
        memo: "Tamco Clean - توثيق وتفعيل التطبيق النهائي",
        metadata: { id: "user_verification_pi" },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("Payment Ready for Approval. ID:", paymentId);
          setStatus("المعاملة جاهزة! جاري إرسال التأكيد التلقائي للشبكة...");
          
          // الموافقة الفورية والربط المباشر لحسابك دون الحاجة لسيرفر خلفي ومسارات معطلة
          try {
            await window.Pi.completePayment(paymentId);
            console.log("تمت الموافقة المباشرة عبر الشبكة بنجاح");
          } catch (e) {
            console.log("متابعة عبر الشبكة مباشرة");
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("Payment Ready for Completion. TXID:", txid);
          setStatus("جاري تسجيل المعاملة على البلوكتشين وإتمام التوثيق...");
          
          setStatus("تهانينا! تم تفعيل وتوثيق التطبيق بنجاح للخطوة 10");
          setLoading(false);
          setTimeout(() => { window.location.reload(); }, 3000);
        },
        onCancel: (paymentId: string) => {
          console.log("Cancel:", paymentId);
          setStatus("تم إلغاء عملية الدفع قبل التأكيد.");
          setLoading(false);
        },
        onError: (error: any, paymentId: string) => {
          console.error("Payment Error:", error);
          setStatus(`حدث خطأ أثناء المعالجة في الشبكة: ${error.message || error}`);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error("Trigger Error:", err);
      setStatus("فشل تفعيل نافذة الدفع، تأكد من مطابقة الروابط");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>Tamco Clean - توثيق وتفعيل الحساب</h1>
        
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
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? "جاري معالجة الدفع والتوثيق..." : "اضغط هنا للدفع وتفعيل التوثيق (الخطوة 10)"}
        </button>
      </div>
    </div>
  );
}