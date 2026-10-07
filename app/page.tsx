"use client";

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

export default function TamcoMainPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        window.Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi Sandbox Mapped Successfully");
      } catch (err) {
        console.error("Pi Init Error:", err);
      }
    }
  }, []);

  const handlePiPayment = async () => {
    if (typeof window === 'undefined' || !window.Pi) {
      setStatus("لاستخدام محفظة Pi يرجى فتح التطبيق من داخل متصفح Pi Browser");
      return;
    }

    setLoading(true);
    setStatus("جاري تحفيز معاملة التوثيق التجريبية...");

    try {
      await window.Pi.createPayment({
        amount: 1,
        memo: "توثيق وتفعيل التطبيق النهائي - Tamco Clean",
        metadata: { id: "user_verification_pi" },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          setStatus("جاري إرسال طلب الموافقة إلى سيرفر تامكو آلياً...");
          try {
            const res = await fetch("https://tamco-app.vercel.app/api/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, action: "approve" }),
            });

            const result = await res.json();

            if (res.ok && !result.error) {
              setStatus("تمت موافقة السيرفر المبدئية، يرجى تأكيد العملية في محفظتك");
              return true; // تمرير الإذن للمحفظة للتوقيع
            } else {
              setStatus(`فشلت موافقة السيرفر: ${result.error || 'خطأ غير معروف'}`);
              setLoading(false);
              return false;
            }
          } catch (e) {
            console.error(e);
            setStatus("حدث خطأ أثناء الاتصال بالسيرفر للموافقة");
            setLoading(false);
            return false;
          }
        },

        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus("جاري تسجيل الحركة على البلوكشين وتوثيق التطبيق...");
          try {
            const res = await fetch("https://tamco-app.vercel.app/api/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid, action: "complete" }),
            });

            const result = await res.json();

            if (res.ok && !result.error) {
              setStatus("تم تفعيل وتوثيق التطبيق بنجاح للخطوة 10!");
              setLoading(false);
              return true;
            } else {
              setStatus(`فشل إتمام الحركة: ${result.error || 'خطأ غير معروف'}`);
              setLoading(false);
              return false;
            }
          } catch (e) {
            console.error(e);
            setStatus("حدث خطأ أثناء الاتصال بالسيرفر لإتمام الحركة");
            setLoading(false);
            return false;
          }
        },

        onCancel: (paymentId: string) => {
          setStatus("تم إلغاء عملية الدفع قبل التأكيد");
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '500px', width: '100%', border: '1px solid #e0e0e0', padding: '30px', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: '#f59e0b', fontSize: '22px', marginBottom: '8px', textAlign: 'center' }}>بوابة توثيق تطبيق تامكو</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', textAlign: 'center' }}>اضغط على الزر أدناه لتفعيل طلب التوثيق المالي عبر شبكة باي</p>

        {status && (
          <div style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '6px', marginBottom: '20px', border: '1px solid #1e293b' }}>
            <p style={{ fontSize: '13px', color: '#10b981', margin: 0, textAlign: 'center', direction: 'rtl' }}>{status}</p>
          </div>
        )}

        <button
          onClick={handlePiPayment}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#64748b' : '#10b981',
            color: 'white',
            border: 'none',
            padding: '14px 20px',
            fontSize: '15px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? "...جاري المعالجة والتوثيق" : "اجتياز الخطوة 10: تفعيل وتوثيق التطبيق"}
        </button>
      </div>
    </div>
  );
}