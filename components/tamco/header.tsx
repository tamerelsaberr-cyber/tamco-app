"use client";

import { useState } from "react";
import { ShoppingCart, Search, Menu, X, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  onSearchClick?: () => void;
}

export function Header({ cartCount = 0, onCartClick, onSearchClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="القائمة"
        >
          {menuOpen ? <X size={22} className="text-foreground" /> : <Menu size={22} className="text-foreground" />}
        </button>

        {/* Center: Logo */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold tracking-widest text-primary" style={{ fontFamily: "serif", letterSpacing: "0.12em" }}>
            TAMCO
          </span>
          <span className="text-[9px] text-muted-foreground tracking-wider uppercase">للأثاث والتصنيع</span>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="البحث"
          >
            <Search size={20} className="text-foreground" />
          </button>
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="السلة"
          >
            <ShoppingCart size={20} className="text-foreground" />
            {cartCount > 0 && (
              <Badge className="absolute -top-0.5 -left-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground border-0">
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="bg-card border-t border-border px-4 py-3 flex flex-col gap-1 shadow-lg">
          {[
            { label: "الرئيسية", href: "#" },
            { label: "أثاث منزلي", href: "#living" },
            { label: "أثاث مكتبي", href: "#office" },
            { label: "الديكور والإكسسوار", href: "#decor" },
            { label: "الدهانات والتشطيبات", href: "#paints" },
            { label: "التصنيع للغير", href: "#manufacturing" },
            { label: "استوديو التصميم", href: "#studio" },
            { label: "تواصل معنا", href: "#contact" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors text-right font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
