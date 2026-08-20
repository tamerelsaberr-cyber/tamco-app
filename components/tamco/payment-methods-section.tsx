"use client";

import { CreditCard, Smartphone, ArrowLeftRight, Pi } from "lucide-react";

const methods = [
  { icon: Pi, label: "Pi Network", desc: "ادفع بعملة باي", color: "bg-purple-50 text-purple-700" },
  { icon: CreditCard, label: "PayNow حملة", desc: "دفع فوري آمن", color: "bg-blue-50 text-blue-700" },
  { icon: ArrowLeftRight, label: "تحويل 50%", desc: "دفع مقسّم على مرحلتين", color: "bg-green-50 text-green-700" },
  { icon: Smartphone, label: "TrustCoin", desc: "عملة رقمية موثوقة", color: "bg-orange-50 text-orange-700" },
];

export function PaymentMethodsSection() {
  return (
    <section id="payment" className="mx-4 mb-5">
      <h2 className="text-base font-bold text-foreground mb-3">طرق الدفع المتاحة</h2>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.label}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2 shadow-sm"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${method.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-xs font-bold text-foreground">{method.label}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{method.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
        <p className="text-xs text-foreground font-medium">
          جميع المدفوعات مؤمّنة ومشفّرة بالكامل
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          مرتبط بمنصات التصميم العالمية
        </p>
      </div>
    </section>
  );
}
