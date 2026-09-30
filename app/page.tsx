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
      setStatus("يرجى فتح التطبيق من داخل متصفح Pi Browser للتفعيل");
      return;
    }

    setLoading(true);
    setStatus("...جاري تحضير معاملة التوثيق التجريبية");

    try {
      await window.Pi.createPayment({
        amount: 1,
        memo: "توثيق وتفعيل التطبيق النهائي - Tamco Clean",
        metadata: { id: "user_verification_pi" },
      }, {
        // 1. مرحلة الموافقة السيرفرية الإلزامية للخطوة 10
        onReadyForServerApproval: async (paymentId: string) => {
          setStatus("جاري إرسال طلب الموافقة إلى سيرفر تامكو آلياً...");
          try {
            const res = await fetch("/api/pi-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, action: "approve" }),
            });
            const result = await res.json();
            
            if (result.success) {
              setStatus("تمت موافقة سيرفر تامكو، يرجى تأكيد العملية في محفظتك...");
            } else {
              setStatus(`فشل موافقة السيرفر: ${result.error}`);
              setLoading(false);
            }
          } catch (e) {
            console.error(e);
            setStatus("حدث خطأ أثناء الاتصال بالسيرفر للموافقة");
            setLoading(false);
          }
        },

        // 2. مرحلة الإتمام النهائي على البلوكشين
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus("تم الدفع بنجاح! جاري تسجيل الحركة على البلوكشين وتوثيق التطبيق...");
          try {
            const res = await fetch("/api/pi-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, action: "complete", txid }),
            });
            const result = await res.json();

            if (result.success) {
              setStatus("تهانينا! تم تفعيل وتوثيق التطبيق بنجاح للخطوة 10 🎉");
              setLoading(false);
              setTimeout(() => { window.location.reload(); }, 3000);
            } else {
              setStatus(`فشل إتمام الحركة: ${result.error}`);
              setLoading(false);
            }
          } catch (e) {
            console.error(e);
            setStatus("حدث خطأ أثناء الاتصال بالسيرفر لإتمام الحركة");
            setLoading(false);
          }
        },

        onCancel: (paymentId: string) => {
          setStatus("تم إلغاء عملية الدفع قبل التأكيد");
          setLoading(false);
        },

        onError: (error: any, paymentId: string) => {
          console.error("Payment Error:", error);
          setStatus(`حدث خطأ أثناء المعالجة في الشبكة: ${error.message}`);
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
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #334155', padding: '24px', borderRadius: '8px', backgroundColor: '#1e293b', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%' }}>
        <h1 style={{ color: '#f59e0b', fontSize: '24px', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>بوابة دفع تامكو للأثاث</h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', textAlign: 'center' }}>اختبار وتجاوز خطوة الدفع رقم 10 للتطبيق النهائي</p>
        
        {status && (
          <div style={{ padding: '16px', backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: '4px', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: '#10b981', margin: 0, textAlign: 'center' }}>{status}</p>
          </div>
        )}

        <button
          onClick={handlePiPayment}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#64748b' : '#10b981',
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
          {loading ? "...جاري معالجة الدفع والتوثيق (الخطوة 10)" : "اضغط هنا لإجراء دفع تجريبي وتجاوز الخطوة 10"}
        </button>
      </div>
    </div>
  );
}