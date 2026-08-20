"use client";

import { Tag, ChevronLeft } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="mx-4 mb-5">
      <div className="bg-gradient-to-l from-[oklch(0.62_0.12_48)] to-[oklch(0.72_0.13_70)] rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
          <Tag size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-bold mb-0.5">عرض حصري للأعضاء الجدد</p>
          <p className="text-white/80 text-xs">خصم 15% على أول طلب — استخدم كود: TAMCO15</p>
        </div>
        <a href="#catalog" className="shrink-0 text-white">
          <ChevronLeft size={18} />
        </a>
      </div>
    </section>
  );
}
