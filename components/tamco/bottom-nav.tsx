"use client";

import { Home, Grid3X3, Box, Heart, User } from "lucide-react";

const tabs = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "catalog", label: "المنتجات", icon: Grid3X3 },
  { id: "studio", label: "التصميم", icon: Box },
  { id: "favorites", label: "المفضلة", icon: Heart },
  { id: "profile", label: "حسابي", icon: User },
];

interface BottomNavProps {
  active?: string;
  onTabChange?: (tab: string) => void;
}

export function BottomNav({ active = "home", onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors active:scale-95"
              aria-label={tab.label}
            >
              <Icon
                size={22}
                className={isActive ? "text-primary" : "text-muted-foreground"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
