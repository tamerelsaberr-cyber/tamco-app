"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TamcoPaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initPi = () => {
        if ((window as any).Pi) {
          try {
            (window as any).Pi.init({ version: "2.0", sandbox: true });
            console.log("تمت تهيئة مكتبة Pi بنجاح");
          } catch (e) {
            console.error("Pi init error:", e);
          }
        }
      };

      initPi();
      // مهلة زمنية للتأكد من حقن المتصفح للمكتبة بشكل كامل
      const timer = setTimeout(initPi, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTestPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const piInstance = (window as any).Pi;

    if (!piInstance) {
      alert("تنبيه: لم يتم العثور على مكتبة Pi بعد، يرجى الانتظار ثانيتين وإعادة المحاولة من داخل التطبيق.");
      return;
    }

    setPaymentStatus("...جاري فتح المحفظة التجريبية وتأكيد المعاملة");

    try {
      piInstance.createPayment({
        amount: 1, // القيمة التجريبية المطلوبة للتوثيق (1 باي)
        memo: "التوثيق التجريبي لتطبيق تامكو - الخطوة 10",
        metadata: { appId: "tamco77478" },
      }, {
        onReadyForServerApproval: function(paymentId: string) {
          console.log("معرف الدفع المعتمد:", paymentId);
          setPaymentStatus("...تمت الموافقة المبدئية، جاري تسجيل الحركة");
        },
        onConfirmed: function(paymentId: string, txid: string) {
          console.log("اكتمل الدفع! رقم الحركة:", txid); // تم إصلاح الخطأ الإملائي هنا consple -> console
          setPaymentStatus("مبروك! تم الدفع بنجاح واجتياز الخطوة 10");
          alert("تم إجراء الدفع التجريبي بنجاح واجتياز الخطوة 10 بنجاح");
        },
        onCancel: function(paymentId: string) {
          setPaymentStatus("تم إلغاء المعاملة من قبلك");
        },
        onError: function(error: any, paymentId: string) {
          console.error("حدث خطأ:", error);
          setPaymentStatus("فشل الدفع: " + error.message);
          alert("فشلت العملية: " + error.message);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl text-center">
        <h1 className="text-2xl font-bold text-amber-500 mb-2">TAMCO</h1>
        <p className="text-sm text-slate-400 mb-6">إدارة وتوثيق تطبيق تامكو</p>
        
        <div className="p-4 bg-slate-900 border border-emerald-500/30 rounded-xl mb-6">
          <h2 className="text-lg font-bold text-emerald-400 mb-1">الفوري والنهائي لتطبيق تامكو</h2>
          <p className="text-xs text-slate-400">تجاوز الخطوة رقم 10 واختبار المحفظة</p>
        </div>

        <button
          onClick={handleTestPayment}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200"
        >
          اضغط هنا لإجراء دفع تجريبي وتجاوز الخطوة 10
        </button>

        {paymentStatus && (
          <p className="mt-4 text-xs text-amber-400 font-medium bg-amber-500/10 py-2 px-3 rounded-lg">
            {paymentStatus}
          </p>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-xl transition duration-200 text-sm"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}