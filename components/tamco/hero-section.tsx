"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "أثاث بجودة عالمية",
    subtitle: "صُنع بأيدٍ خبيرة لمنزلك المثالي",
    cta: "تسوّق الآن",
    href: "#living",
    bg: "from-[oklch(0.24_0.06_40)] to-[oklch(0.38_0.08_42)]",
    image: "/placeholder.svg?height=480&width=400",
    tag: "أثاث منزلي",
  },
  {
    id: 2,
    title: "تصنيع حسب الطلب",
    subtitle: "نُحوّل أفكارك إلى قطع أثاث فريدة",
    cta: "اطلب تصميمك",
    href: "#manufacturing",
    bg: "from-[oklch(0.38_0.08_42)] to-[oklch(0.52_0.10_48)]",
    image: "/placeholder.svg?height=480&width=400",
    tag: "تصنيع للغير",
  },
  {
    id: 3,
    title: "استوديو التصميم الثلاثي",
    subtitle: "شاهد أثاثك في مكانه قبل الشراء",
    cta: "جرّب الآن",
    href: "#studio",
    bg: "from-[oklch(0.52_0.10_48)] to-[oklch(0.62_0.12_48)]",
    image: "/placeholder.svg?height=480&width=400",
    tag: "تصميم ثلاثي الأبعاد",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div className={`relative bg-gradient-to-br ${slide.bg} min-h-[300px] flex flex-col justify-end px-5 pb-6 pt-10`}>
        {/* Tag */}
        <span className="inline-block self-end mb-3 px-3 py-1 bg-accent/80 text-accent-foreground text-xs font-semibold rounded-full tracking-wide">
          {slide.tag}
        </span>

        {/* Text */}
        <h1 className="text-2xl font-bold text-[oklch(0.97_0.012_80)] leading-snug text-balance mb-1">
          {slide.title}
        </h1>
        <p className="text-sm text-[oklch(0.85_0.015_70)] mb-4 leading-relaxed">
          {slide.subtitle}
        </p>

        <a
          href={slide.href}
          className="self-start inline-flex items-center gap-2 bg-[oklch(0.72_0.13_70)] text-[oklch(0.18_0.02_40)] font-semibold text-sm px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 active:scale-95"
        >
          {slide.cta}
          <ChevronLeft size={16} />
        </a>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current ? "w-6 h-2 bg-[oklch(0.72_0.13_70)]" : "w-2 h-2 bg-white/40"
              }`}
              aria-label={`الشريحة ${i + 1}`}
            />
          ))}
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
          className="absolute top-1/2 left-3 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/20 text-white rounded-full"
          aria-label="السابق"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setCurrent((c) => (c + 1) % slides.length)}
          className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/20 text-white rounded-full"
          aria-label="التالي"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
