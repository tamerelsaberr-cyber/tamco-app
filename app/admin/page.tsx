"use client";

import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 1500);
  };

  const handlePiPayment = () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.createPayment({
        amount: 0.1,
        memo: "تجربة دفع من متجر تامكو",
        metadata: { orderId: "123" }
      }, {
        onReadyForServerApproval: (paymentId: string) => console.log("Ready:", paymentId),
        onReadyForServerCompletion: (paymentId: string, txid: string) => console.log("Complete:", txid),
        onCancel: () => console.log("Cancelled"),
        onError: (err: any) => console.log("Error:", err)
      });
    } else {
      alert("يرجى فتح التطبيق من داخل متصفح أو محاكي باي الرسمي");
    }
  };

  if (!mounted) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>جاري تحميل لوحة التحكم بأمان...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-right" dir="rtl">
        <div className="text-center p-8 bg-white shadow-md rounded-lg max-w-md border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">لوحة تحكم الآدمن</h1>
          <p className="text-slate-600 mb-6">يرجى تسجيل الدخول باستخدام حساب باي الخاص بك للمتابعة</p>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 text-slate-900 font-bold rounded shadow transition-all"
          >
            {isLoading ? "جاري الدخول..." : "جاري الاتصال بشبكة Pi Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-right" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 border-b pb-4 mb-6">لوحة تحكم الآدمن الرئيسية (TAMCO)</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-2">إعدادات واجهة المتجر</h2>
            <p className="text-sm text-slate-500">من هنا يمكنك مستقبلاً ربط الـ API Key الخاص بمتجرك لتعديل مطبوعات متجرك تلقائياً.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-2">إحصائيات مدفوعات Pi Network</h2>
            <p className="text-sm text-slate-500">مراقبة الطلبات المعلقة، ورؤية المستخدمين المتصلين بالتطبيق.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handlePiPayment}
            className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded shadow transition-all"
          >
            تجربة الدفع عبر محفظة Pi
          </button>
          
          <button
            onClick={() => setIsLoggedIn(false)}
            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded self-start transition-all"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}