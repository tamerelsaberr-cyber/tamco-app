"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  isNew?: boolean;
}

const products: Product[] = [
  { id: 1, name: "طاولة طعام خشب الجوز", category: "أثاث منزلي", price: 2850, currency: "ر.س", rating: 4.8, reviews: 124, image: "/placeholder.svg?height=220&width=200", badge: "الأكثر مبيعاً" },
  { id: 2, name: "كنبة كلاسيك 3 مقاعد", category: "أثاث منزلي", price: 4200, currency: "ر.س", rating: 4.7, reviews: 98, image: "/placeholder.svg?height=220&width=200", isNew: true },
  { id: 3, name: "مكتب تنفيذي راقي", category: "أثاث مكتبي", price: 3100, currency: "ر.س", rating: 4.9, reviews: 67, image: "/placeholder.svg?height=220&width=200" },
  { id: 4, name: "خزانة ملابس 6 أبواب", category: "أثاث منزلي", price: 5600, currency: "ر.س", rating: 4.6, reviews: 43, image: "/placeholder.svg?height=220&width=200", badge: "تخفيض 15%" },
  { id: 5, name: "كرسي مكتبي أرغونوميك", category: "أثاث مكتبي", price: 1400, currency: "ر.س", rating: 4.5, reviews: 210, image: "/placeholder.svg?height=220&width=200", isNew: true },
  { id: 6, name: "ركيزة ديكور خشبية", category: "الديكور", price: 680, currency: "ر.س", rating: 4.4, reviews: 55, image: "/placeholder.svg?height=220&width=200" },
];

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export function FeaturedProducts({ onAddToCart, onProductClick }: FeaturedProductsProps) {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="px-4 pb-5" id="living">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-foreground">منتجات مميزة</h2>
        <a href="#" className="text-xs text-accent font-medium">عرض الكل</a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border active:scale-[0.98] transition-transform cursor-pointer"
            onClick={() => onProductClick?.(product)}
          >
            {/* Image */}
            <div className="relative bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 object-cover"
              />
              {/* Badge */}
              {product.badge && (
                <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {product.badge}
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  جديد
                </span>
              )}
              {/* Like button */}
              <button
                onClick={(e) => toggleLike(product.id, e)}
                className="absolute top-2 left-2 w-7 h-7 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center"
                aria-label="أضف للمفضلة"
              >
                <Heart
                  size={14}
                  className={liked.has(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                />
              </button>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-[10px] text-muted-foreground mb-0.5">{product.category}</p>
              <h3 className="text-xs font-semibold text-foreground leading-tight mb-1.5 text-balance">
                {product.name}
              </h3>
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star size={10} className="fill-[oklch(0.72_0.13_70)] text-[oklch(0.72_0.13_70)]" />
                <span className="text-[10px] text-muted-foreground">{product.rating} ({product.reviews})</span>
              </div>
              {/* Price + Cart */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">
                  {product.price.toLocaleString("ar-SA")} {product.currency}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
                  className="w-7 h-7 bg-primary rounded-full flex items-center justify-center active:scale-90 transition-transform"
                  aria-label="أضف للسلة"
                >
                  <ShoppingCart size={13} className="text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
