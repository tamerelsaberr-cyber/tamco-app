"use client";

import { Sofa, Monitor, Palette, Layers, Wrench, Package } from "lucide-react";

const categories = [
  { id: "living", label: "أثاث منزلي", icon: Sofa, color: "bg-[oklch(0.92_0.04_50)]", href: "#living" },
  { id: "office", label: "أثاث مكتبي", icon: Monitor, color: "bg-[oklch(0.90_0.03_55)]", href: "#office" },
  { id: "decor", label: "الديكور", icon: Palette, color: "bg-[oklch(0.91_0.04_65)]", href: "#decor" },
  { id: "accessories", label: "الإكسسوارات", icon: Layers, color: "bg-[oklch(0.90_0.035_70)]", href: "#accessories" },
  { id: "manufacturing", label: "تصنيع للغير", icon: Wrench, color: "bg-[oklch(0.92_0.04_45)]", href: "#manufacturing" },
  { id: "paints", label: "الدهانات", icon: Package, color: "bg-[oklch(0.91_0.03_60)]", href: "#paints" },
];

export function CategoriesSection() {
  return (
    <section className="px-4 py-5" id="categories">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-foreground">تصفح الأقسام</h2>
        <a href="#" className="text-xs text-accent font-medium">الكل</a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <a
              key={cat.id}
              href={cat.href}
              className={`${cat.color} rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={22} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground text-center leading-tight">{cat.label}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
