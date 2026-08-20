"use client";

import { X, Star, Heart, ShoppingCart, Box, Share2 } from "lucide-react";
import { useState } from "react";
import type { Product } from "./featured-products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [liked, setLiked] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Image */}
        <div className="relative bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-52 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <X size={16} className="text-foreground" />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="absolute top-3 left-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2">
          {/* Category & Share */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-accent font-medium">{product.category}</span>
            <button className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center">
              <Share2 size={13} className="text-muted-foreground" />
            </button>
          </div>

          {/* Name */}
          <h2 className="text-lg font-bold text-foreground leading-snug mb-2">{product.name}</h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(product.rating) ? "fill-[oklch(0.72_0.13_70)] text-[oklch(0.72_0.13_70)]" : "text-border fill-border"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews} تقييم)
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            قطعة أثاث فاخرة مصنوعة من أجود الخامات، بتصميم عصري يناسب ذوقك الرفيع. متوفرة بأحجام وألوان متعددة حسب الطلب.
          </p>

          {/* 3D Preview */}
          <div className="bg-secondary/60 border border-border rounded-xl p-3 flex items-center gap-3 mb-4">
            <Box size={20} className="text-accent shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">شاهد هذا المنتج في غرفتك</p>
              <p className="text-[11px] text-muted-foreground">استخدم تقنية الواقع المعزز</p>
            </div>
            <button className="mr-auto text-xs font-semibold text-accent shrink-0">جرّب</button>
          </div>

          {/* Qty */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-foreground font-medium">الكمية</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 border border-border rounded-full flex items-center justify-center text-foreground font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">السعر</p>
            <p className="text-lg font-bold text-primary">
              {(product.price * qty).toLocaleString("ar-SA")} {product.currency}
            </p>
          </div>
          <button
            onClick={() => { onAddToCart(product); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-transform"
          >
            <ShoppingCart size={17} />
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
}
