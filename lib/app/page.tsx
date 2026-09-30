"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TamcoPaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initPi = () => {
        if ((window as any).Pi) {
          try {
            (window as any).Pi.init({ version: "2.0", sandbox: true });
            console.log("بنجاح Pi تمت تهيئة مكتبة");
          } catch (e) {
            console.error("Pi init error:", e);
          }
        }
      };
      initPi();
    }
  }, []);

  const handleTestPayment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const piInstance = (window as any).Pi;

    if (!piInstance) {
      alert("التطبيق تنبيه: لم يتم العثور على مكتبة Pi");
      return;
    }

    setPaymentStatus("جاري فتح المحفظة التجريبية وتأكيد المعاملة...");

    try {
      piInstance.createPayment({
        amount: 1, // 1 باي للتجربة واجتياز الخطوة 10
        memo: "الخطوة 10 - التوثيق التجريبي لتطبيق تامكو",
        metadata: { appId: "tamco77478" },
      }, {
        // الخطوة أ: الموافقة السيرفرية (Server Approval)
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("معرف الدفع المعتمد للبدء:", paymentId);
          setPaymentStatus("جاري إرسال الموافقة السيرفرية (Approval)...");

          try {
            const res = await fetch("/api/pi-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, action: "approve" }),
            });
            const result = await res.json();
            
            if (result.success) {
              setPaymentStatus("تمت موافقة السيرفر بنجاح، يرجى تأكيد الدفع في محفظتك...");
            } else {
              setPaymentStatus(`فشل موافقة السيرفر: ${result.error}`);
            }
          } catch (err) {
            console.error(err);
            setPaymentStatus("خطأ في الاتصال بالخلفية أثناء الموافقة");
          }
        },

        // الخطوة ب: الإتمام النهائي على البلوكشين (Server Completion)
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("اكتمل الدفع! رقم الحركة:", txid);
          setPaymentStatus("جاري تسجيل وإتمام الحركة على البلوكشين...");

          try {
            const res = await fetch("/api/pi-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, action: "complete", txid }),
            });
            const result = await res.json();

            if (result.success) {
              setPaymentStatus("تهانينا! تم الدفع بنجاح واجتياز الخطوة 10 بنجاح 🎉");
              alert("تم الدفع واجتياز الخطوة 10 بنجاح!");
            } else {
              setPaymentStatus(`فشل إتمام الحركة: ${result.error}`);
            }
          } catch (err) {
            console.error(err);
            setPaymentStatus("خطأ في الاتصال بالخلفية أثناء الإتمام");
          }
        },

        onCancel: (paymentId: string) => {
          setPaymentStatus("تم إلغاء المعاملة من قبلك");
          console.log("تم الإلغاء:", paymentId);
        },

        onError: (error: any, paymentId: string) => {
          console.error("حدث خطأ:", error);
          setPaymentStatus(`فشل الدفع: ${error.message}`);
          alert(`فشلت العملية: ${error.message}`);
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-amber-500 mb-2 text-center">بوابة دفع تامكو التجريبية</h1>
        <p className="text-sm text-slate-400 mb-6 text-center">توثيق واختبار خطوة الدفع رقم 10 لتطبيق تامكو للأثاث</p>
        
        <div className="p-4 bg-slate-900 border border-emerald-500 rounded mb-6">
          <h2 className="text-lg font-bold text-emerald-400 mb-1">حالة المعاملة:</h2>
          <p className="text-xs text-slate-300">{paymentStatus || "في انتظار بدء عملية الدفع..."}</p>
        </div>

        <button
          onClick={handleTestPayment}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded transition duration-200 mb-4"
        >
          اضغط هنا لإجراء دفع تجريبي وتجاوز الخطوة 10
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}