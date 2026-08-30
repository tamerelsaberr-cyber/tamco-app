"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [paymentStatus, setPaymentStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    // تحميل مكتبة Pi بأمان عند فتح الصفحة دون القيام بعملية مصادقة قسرية تسبب شاشة بيضاء
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        (window as any).Pi.init({ version: "2.0", sandbox: true });
      } catch (e) {
        console.error("Pi init error:", e);
      }
    }
  }, []);

  // دالة الدفع التجريبي المباشرة
  const handleTestPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 

    if (!(window as any).Pi) {
      alert("يرجى فتح التطبيق من داخل Pi Browser الرسمي لتشغيل المحفظة.");
      return;
    }

    setPaymentStatus("جاري استدعاء المحفظة التجريبية وتأكيد المعاملة...");

    try {
      (window as any).Pi.createPayment({
        amount: 1, // القيمة المطلوبة للتوثيق
        memo: "التوثيق التجريبي لتطبيق تامكو - الخطوة 10",
        metadata: { appId: "tamco77478" } // معرف تطبيقك
      }, {
        onReadyForServerApproval: function(paymentId: string) {
          console.log("معرف الدفع المعتمد:", paymentId);
          setPaymentStatus("تمت الموافقة المبدئية، جاري تسجيل الحركة...");
        },
        onReadyForServerCompletion: function(paymentId: string, txid: string) {
          console.log("اكتمل الدفع! رقم الحركة:", txid);
          setPaymentStatus("مبروك! تم الدفع بنجاح واجتزت الخطوة 10.");
          alert("تم إجراء الدفع التجريبي بنجاح واجتزت الخطوة 10!");
        },
        onCancel: function(paymentId: string) {
          setPaymentStatus("تم إلغاء المعاملة.");
        },
        onError: function(error: any, paymentId: string) {
          console.error("خطأ:", error);
          setPaymentStatus("فشل الدفع: " + error.message);
          alert("فشلت العملية: " + error.message);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6" style={{ direction: "rtl" }}>
      <div className="max-w-md w-full bg-slate-800 p-8 border border-slate-700 rounded-2xl text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-amber-500 mb-2">TAMCO لوحة إدارة وتوثيق</h1>
        <p className="text-sm text-slate-400 mb-6">مرحباً بك في بوابة التوثيق المباشر لتطبيق تامكو</p>
        
        <div className="p-4 bg-slate-900 border border-emerald-500/30 rounded-xl mb-6">
          <h2 className="text-lg font-bold text-emerald-400 mb-1">اجتياز الخطوة رقم 10</h2>
          <p className="text-xs text-slate-400">اضغط على الزر أدناه لتشغيل المحفظة وتأكيد الدفع التجريبي مباشرة.</p>
        </div>

        <button 
          onClick={handleTestPayment}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg transform active:scale-95"
        >
          اضغط هنا لإجراء دفع تجريبي
        </button>
        
        {paymentStatus && (
          <p className="mt-4 text-xs text-amber-400 font-medium animate-pulse">{paymentStatus}</p>
        )}
        
        <button 
          onClick={() => router.push("/")}
          className="mt-6 text-xs text-slate-500 hover:text-slate-400 underline block mx-auto"
        >
          العودة للمتجر الرئيسي
        </button>
      </div>
    </div>
  );
}