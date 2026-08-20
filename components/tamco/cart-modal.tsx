"use client";

import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import type { Product } from "./featured-products";

interface CartItem extends Product {
  qty: number;
}

interface CartModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export function CartModal({ isOpen, items, onClose, onUpdateQty, onRemove }: CartModalProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">سلة التسوق</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{items.length} منتج</span>
            <button onClick={onClose} className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center">
              <X size={15} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <ShoppingBag size={48} className="text-border" />
              <p className="text-sm text-muted-foreground">السلة فارغة</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-secondary/40 rounded-xl p-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-sm font-bold text-primary mt-0.5">
                    {(item.price * item.qty).toLocaleString("ar-SA")} {item.currency}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-6 h-6 flex items-center justify-center text-destructive"
                    aria-label="حذف"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="w-6 h-6 bg-card border border-border rounded-md flex items-center justify-center"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="w-6 h-6 bg-primary text-primary-foreground rounded-md flex items-center justify-center"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">الإجمالي</span>
              <span className="text-lg font-bold text-primary">
                {total.toLocaleString("ar-SA")} ر.س
              </span>
            </div>
            <button className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-transform">
              متابعة الدفع
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
