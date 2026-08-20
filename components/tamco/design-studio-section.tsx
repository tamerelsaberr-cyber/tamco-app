"use client";

import { useState } from "react";
import { Box, Cpu, Timer, ChevronLeft, CheckCircle } from "lucide-react";

const plans = [
  { label: "30 دقيقة", price: 25, unit: "ر.س" },
  { label: "ساعة كاملة", price: 45, unit: "ر.س" },
  { label: "3 ساعات", price: 110, unit: "ر.س" },
];

export function DesignStudioSection() {
  const [selected, setSelected] = useState(1);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequest = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  return (
    <section id="studio" className="mx-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Box size={18} className="text-accent" />
        <h2 className="text-base font-bold text-foreground">استوديو التصميم الثلاثي</h2>
      </div>

      {/* Description Card */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-sm">
        <p className="text-sm text-foreground leading-relaxed mb-3">
          شاهد أثاثك في مكانه الحقيقي قبل الشراء! ارفع صورة غرفتك واختر الأثاث لترى كيف يبدو بأبعاده الحقيقية باستخدام تقنية الواقع المعزز.
        </p>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <Cpu size={14} className="text-accent" />
            <span className="text-xs text-muted-foreground">تصميم ذكي</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Timer size={14} className="text-accent" />
            <span className="text-xs text-muted-foreground">نتائج فورية</span>
          </div>
        </div>
      </div>

      {/* Preview Image */}
      <div className="rounded-2xl overflow-hidden bg-secondary border border-border mb-3 relative">
        <img
          src="/placeholder.svg?height=180&width=400"
          alt="معاينة التصميم الثلاثي"
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <span className="text-white text-sm font-semibold">معاينة الأثاث في غرفتك</span>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-foreground mb-3">اختر مدة الاستخدام</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {plans.map((plan, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`rounded-xl p-3 text-center border-2 transition-colors ${
                selected === i
                  ? "border-accent bg-accent/10"
                  : "border-border bg-secondary/50"
              }`}
            >
              <p className="text-xs font-semibold text-foreground mb-0.5">{plan.label}</p>
              <p className="text-sm font-bold text-accent">
                {plan.price} {plan.unit}
              </p>
            </button>
          ))}
        </div>
        <button
          onClick={handleRequest}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-xl active:scale-[0.98] transition-transform"
        >
          {requestSent ? (
            <>
              <CheckCircle size={16} />
              تم إرسال الطلب!
            </>
          ) : (
            <>
              ابدأ التصميم الآن
              <ChevronLeft size={16} />
            </>
          )}
        </button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          يمكنك أيضاً الاستعانة بفريق مصممينا مقابل رسوم إضافية
        </p>
      </div>
    </section>
  );
}
