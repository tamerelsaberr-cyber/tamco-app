"use client";

import { CreditCard, Smartphone, ArrowLeftRight, Pi } from "lucide-react";

declare global {
  interface Window {
    Pi?: any;
  }
}

const methods = [
  { icon: Pi, label: "Pi Network", desc: "عملة باي" },
  { icon: CreditCard, label: "PayNow", desc: "سريع وآمن" },
  { icon: ArrowLeftRight, label: "50", desc: "تحويل عملتين" },
  { icon: Smartphone, label: "TrustCoin", desc: "محفظة رقمية" },
];

export function PaymentMethodsSection() {
  const handlePiPayment = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        await window.Pi.init({ version: "2.0", sandbox: true });

        const scopes = ["username", "payments"];
        await window.Pi.authenticate(scopes, (payment: any) => {
          console.log("Payment in progress: ", payment);
        });

        const serverPaymentRes = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: 1, 
            memo: "Complete Step 10 Verification" 
          })
        });

        const serverPaymentData = await serverPaymentRes.json();

        if (!serverPaymentData || !serverPaymentData.identifier) {
          alert("خطأ: لم يتمكن السيرفر من جلب معرف الدفع الجديد");
          return;
        }

        window.Pi.createPayment({
          paymentId: serverPaymentData.identifier
        }, {
          onReadyForServerApproval: async function(paymentId: string) {
            try {
              await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, action: "approve" })
              });
            } catch (err) {
              console.error("Approval error:", err);
            }
          },
          onReadyForServerCompletion: async function(paymentId: string, txid: string) {
            try {
              await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid, action: "complete" })
              });
              alert("تمت عملية الدفع وتوثيق الخطوة بنجاح كامل!");
            } catch (err) {
              console.error("Completion error:", err);
            }
          },
          onCancel: function(paymentId: string) {
            alert("تم إلغاء عملية الدفع من قبل المستخدم");
          },
          onError: function(error: any, payment: any) {
            alert("حدث خطأ أثناء معالجة الدفع: " + error.message);
          }
        });

      } catch (error: any) {
        alert("فشلت عملية المصادقة أو التهيئة: " + error.message);
      }
    } else {
      alert("تنبيه: يرجى فتح الرابط من داخل تطبيق Pi Browser");
    }
  };

  return (
    <section id="payment" className="mx-4 mb-5">
      <h2 className="text-base font-bold text-foreground mb-3">طرق الدفع</h2>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isPi = method.label === "Pi Network";

          return (
            <div
              key={method.label}
              onClick={() => isPi ? handlePiPayment() : undefined}
              className={`bg-card border border-border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all ${
                !isPi ? "opacity-60 cursor-not-allowed" : "hover:border-primary/50"
              }`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted">
                <Icon size={18} />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-foreground">{method.label}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{method.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}