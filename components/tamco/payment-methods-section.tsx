"use client";

import { CreditCard, Smartphone, ArrowLeftRight, Pi } from "lucide-react";

declare global {
  interface Window {
    Pi?: any;
  }
}

const methods = [
  { icon: Pi, label: "Pi Network", desc: "ادفع بعملة باي" },
  { icon: CreditCard, label: "PayNow", desc: "دفع فوري آمن" },
  { icon: ArrowLeftRight, label: "50", desc: "تحويل على مرحلتين" },
  { icon: Smartphone, label: "TrustCoin", desc: "عملة رقمية موثوقة" },
];

export function PaymentMethodsSection() {
  
  const handlePiPayment = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        // 1. تهيئة مكتبة باي وتفعيل الوضع التجريبي
        await window.Pi.init({ version: "2.0", sandbox: true });

        // 2. طلب تسجيل الدخول والمصادقة للمستخدم
        const scopes = ["username", "payments"];
        await window.Pi.authenticate(scopes, (payment: any) => {
          console.log("Payment in progress: ", payment);
        });

        // 3. إطلاق واجهة الدفع والربط المباشر مع الـ Backend (route.ts)
        window.Pi.createPayment({
          amount: 1, 
          memo: "Complete Step 10 Verification", 
          metadata: { internalId: "verification_step_10" }
        }, {
          // خطوة الموافقة الرسمية من السيرفر
          onReadyForServerApproval: async function(paymentId: string) {
            try {
              const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, action: "approve" })
              });
              const data = await res.json();
              console.log("Server Approval Response:", data);
            } catch (err) {
              console.error("Approval error:", err);
            }
          },
          // خطوة إتمام البلوكشين وتأكيد الدفع النهائي
          onReadyForServerCompletion: async function(paymentId: string, txid: string) {
            try {
              const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid, action: "complete" })
              });
              const data = await res.json();
              console.log("Server Completion Response:", data);
              alert("تمت عملية الدفع وتوثيق الخطوة بنجاح كامل!");
            } catch (err) {
              console.error("Completion error:", err);
            }
          },
          onCancel: function(paymentId: string) {
            alert("تم إلغاء عملية الدفع من قبل المستخدم.");
          },
          onError: function(error: any, payment: any) {
            alert("حدث خطأ أثناء معالجة الدفع: " + error.message);
          }
        });

      } catch (error: any) {
        alert("فشلت عملية المصادقة أو التهيئة: " + error.message);
      }
    } else {
      alert("تنبيه: يرجى فتح الرابط من داخل تطبيق Pi Browser الرسمي لتفعيل اتصال المحفظة!");
    }
  };

  return (
    <section id="payment" className="mx-4 mb-5">
      <h2 className="text-base font-bold text-foreground mb-3">المتاحة</h2>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isPi = method.label === "Pi Network";
          
          return (
            <div
              key={method.label}
              onClick={isPi ? handlePiPayment : undefined}
              className={`bg-card border border-border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                isPi 
                  ? "border-primary/50 ring-2 ring-primary/10 cursor-pointer hover:opacity-90" 
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-foreground">{method.label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{method.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}