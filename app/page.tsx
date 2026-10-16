"use client";

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Pi: any;
  }
}

export default function TamcoMainPage() {
  const [loading, setLoading] = useState(false);
  const [sdkStatus, setSdkStatus] = useState('جاري فحص مكتبة Pi...');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true });
          setSdkStatus("✓ متصل بشبكة Pi بنجاح");
        } catch (err) {
          setSdkStatus("حدث خطأ أثناء تهيئة البيئة البرمجية.");
        }
      } else {
        setSdkStatus("⚠️ يرجى فتح التطبيق من داخل متصفح Pi Browser");
      }
    }
  }, []);

  const handlePayment = async () => {
    if (typeof window === 'undefined' || !window.Pi) {
      alert("يرجى تشغيل التطبيق من متصفح Pi لتفعيل الدفع.");
      return;
    }

    setLoading(true);
    try {
      window.Pi.createPayment({
        amount: 1,
        memo: "تفعيل اشتراك تطبيق تامكو - Tamco Pay Verification",
        metadata: { appId: "tamco" }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, action: "approve" })
          });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid, action: "complete" })
          });
          alert("تم التوثيق والتفعيل بنجاح! ✓");
          setLoading(false);
        },
        onCancel: (paymentId: string) => {
          alert("تم إلغاء عملية الدفع.");
          setLoading(false);
        },
        onError: (error: any, paymentId: string) => {
          console.error(error);
          alert("حدث خطأ أثناء المعاملة.");
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center", direction: "rtl" }}>
      <h1 style={{ color: "#8a2be2" }}>تطبيق تامكو - لوحة تحكم التوثيق</h1>
      
      <div style={{ padding: "20px", margin: "20px auto", maxWidth: "500px", borderRadius: "8px", background: "#f4f4f9", border: "1px solid #ccc" }}>
        <h3>حالة الاتصال بالشبكة:</h3>
        <p style={{ fontWeight: "bold", color: sdkStatus.startsWith("✓") ? "green" : "orange" }}>{sdkStatus}</p>
        
        <button 
          onClick={handlePayment} 
          disabled={loading}
          style={{ padding: "12px 24px", background: "#8a2be2", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginTop: "15px" }}
        >
          {loading ? "جاري المعالجة..." : "اضغط هنا لإتمام خطوة التوثيق (1 Pi)"}
        </button>
      </div>
    </main>
  );
}