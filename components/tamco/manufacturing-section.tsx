"use client";

import { Wrench, Ruler, Palette, Clock, ChevronLeft } from "lucide-react";

const features = [
  { icon: Ruler, label: "أبعاد مخصصة", desc: "حدد القياسات الدقيقة لأثاثك" },
  { icon: Palette, label: "اختيار الخامات", desc: "أخشاب ونسيج وإكسسوار عالي الجودة" },
  { icon: Wrench, label: "صناعة يدوية", desc: "تنفيذ بأيدي حرفيين متخصصين" },
  { icon: Clock, label: "تسليم في الموعد", desc: "نلتزم بالجدول الزمني المتفق عليه" },
];

export function ManufacturingSection() {
  return (
    <section id="manufacturing" className="mx-4 mb-5 rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[oklch(0.24_0.06_40)] to-[oklch(0.38_0.08_42)] px-5 py-5">
        <span className="text-[oklch(0.72_0.13_70)] text-xs font-semibold uppercase tracking-widest mb-1 block">
          خدمة حصرية
        </span>
        <h2 className="text-xl font-bold text-[oklch(0.97_0.012_80)] leading-snug mb-2">
          التصنيع للغير
        </h2>
        <p className="text-sm text-[oklch(0.80_0.02_70)] leading-relaxed">
          نُنفّذ مشاريع الأثاث للشركات والمقاولين والأفراد بأعلى معايير الجودة وأسعار تنافسية.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-px bg-border">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="bg-card p-4 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground">{f.label}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-5 py-4 flex items-center justify-between bg-secondary/50">
        <span className="text-xs text-muted-foreground">ابدأ مشروعك اليوم</span>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full"
        >
          اطلب عرض سعر <ChevronLeft size={13} />
        </a>
      </div>
    </section>
  );
}
