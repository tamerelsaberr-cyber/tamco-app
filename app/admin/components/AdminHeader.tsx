"use client";
import { useState } from "react";

const PERMISSIONS: any = {
  "tamer": { name: "تامر - المدير", pass: "TAMER2024", sections: ["ALL"] },
  "store": { name: "المخزن", pass: "STORE2024", sections: ["inventory"] },
};

const ALL_SECTIONS = [
  { id: "dashboard", label: "الرئيسية" },
  { id: "ads", label: "الدعاية والإعلان ✨" },
  { id: "inventory", label: "المخزون" },
  { id: "orders", label: "الطلبات" },
  { id: "users", label: "المستخدمين" },
];

export default function AdminHeader({ currentUser = "tamer" }: { currentUser?: string }) {
  const [active, setActive] = useState("dashboard");
  const userPerms = PERMISSIONS[currentUser]?.sections || ["ALL"];
  
  const visibleSections = userPerms.includes("ALL") 
    ? ALL_SECTIONS 
    : ALL_SECTIONS.filter(s => userPerms.includes(s.id));

  return (
    <div className="w-full bg-black border border-[#d4af37]/30 rounded-2xl p-2 flex flex-wrap gap-2 justify-center shadow-lg">
      {visibleSections.map((sec) => (
        <button
          key={sec.id}
          onClick={() => setActive(sec.id)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all
            ${active === sec.id 
              ? "bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]" 
              : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-[#d4af37] border border-white/10"
            }`}
        >
          {sec.label}
        </button>
      ))}
      <div className="w-full text-center mt-3 text-xs text-white/40">
        مرحبا {PERMISSIONS[currentUser]?.name} - مسجل دخول
      </div>
    </div>
  );
}