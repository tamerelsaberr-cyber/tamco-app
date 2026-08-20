"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="mx-4 mb-24">
      <h2 className="text-base font-bold text-foreground mb-3">تواصل معنا</h2>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-2 mb-4">
        {[
          { icon: Phone, label: "+966 5X XXX XXXX", href: "tel:+966500000000" },
          { icon: Mail, label: "info@tamco.sa", href: "mailto:info@tamco.sa" },
          { icon: MapPin, label: "الرياض، المملكة العربية السعودية", href: "#" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={16} className="text-primary" />
              </div>
              <span className="text-sm text-foreground">{item.label}</span>
            </a>
          );
        })}
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">أرسل لنا رسالة</p>

        <input
          type="text"
          placeholder="الاسم الكامل"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right"
        />
        <input
          type="tel"
          placeholder="رقم الجوال"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right"
        />
        <textarea
          placeholder="نص الرسالة..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={3}
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right resize-none"
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-xl active:scale-[0.98] transition-transform"
        >
          {sent ? (
            <><CheckCircle size={16} /> تم الإرسال بنجاح!</>
          ) : (
            <><Send size={16} /> إرسال</>
          )}
        </button>
      </form>
    </section>
  );
}
