
"use client";

import { CreditCard, Smartphone, ArrowLeftRight, Pi } from "lucide-react";

// تعريف واجهة window لمنع أخطاء التايب سكريبت (TypeScript)
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
  
  // دالة التعامل مع الدفع والمصادقة الخاصة بـ Pi Network
  const handlePiPayment = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        // 1. طلب تسجيل الدخول والمصادقة (خطوة إلزامية لتوقيع المعاملات)
        const scopes = ["username", "payments"];
        await window.Pi.authenticate(scopes, (payment: any) => {
          console.log("Payment in progress: ", payment);
        });

        // 2. إطلاق واجهة الدفع الرسمية وتجهيز معالجة البيانات
        window.Pi.createPayment({
          amount: 1, // قيمة المبلغ المطلوب نقله بالعملة التجريبية
          memo: "Complete Step 10 Verification", // الوصف المكتوب بلوحة التحكم
          metadata: { internalId: "verification_step_10" }
        }, {
          onReadyForServerApproval: function(paymentId: string) {
            console.log("Ready for server approval, ID:", paymentId);
            // هنا يرسل الكود المعرف إلى الـ API الخاص بـ Backend لتوثيقه مع خوادم باى
          },
          onReadyForServerCompletion: function(paymentId: string, txid: string) {
            console.log("Payment completed on blockchain. TXID:", txid);
            alert("تمت عملية الدفع وتوثيق الخطوة بنجاح!");
          },
          onCancel: function(paymentId: string) {
            alert("تم إلغاء عملية الدفع من قبل المستخدم.");
          },
          onError: function(error: any, payment: any) {
            alert("حدث خطأ أثناء معالجة الدفع: " + error.message);
          }
        });

      } catch (error: any) {
        alert("فشلت عملية المصادقة مع المحفظة: " + error.message);
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
              // تفعيل ميزة الضغط في حال كان الخيار هو Pi Network فقط
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