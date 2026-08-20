"use client";

import { useState } from "react";
import { Header } from "@/components/tamco/header";
import { HeroSection } from "@/components/tamco/hero-section";
import { CategoriesSection } from "@/components/tamco/categories-section";
import { PromoBanner } from "@/components/tamco/promo-banner";
import { FeaturedProducts } from "@/components/tamco/featured-products";
import { ManufacturingSection } from "@/components/tamco/manufacturing-section";
import { DesignStudioSection } from "@/components/tamco/design-studio-section";
import { PaymentMethodsSection } from "@/components/tamco/payment-methods-section";
import { ContactSection } from "@/components/tamco/contact-section";
import { BottomNav } from "@/components/tamco/bottom-nav";
import { CartModal } from "@/components/tamco/cart-modal";
import { ProductDetailModal } from "@/components/tamco/product-detail-modal";
import type { Product } from "@/components/tamco/featured-products";

interface CartItem extends Product {
  qty: number;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const handlePiPayment = () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.createPayment({
        amount: 0.1,
        memo: "تجربة دفع من واجهة تامو الرئيسية",
        metadata: { orderId: "999" }
      }, {
        onReadyForServerApproval: (paymentId: string) => console.log("Approved:", paymentId),
        onReadyForServerCompletion: (paymentId: string, txid: string) => alert("🎯 تم الدفع بنجاح!"),
        onCancel: () => console.log("Cancelled"),
        onError: (err: any) => console.log("Error:", err)
      });
    } else {
      alert("يرجى فتح التطبيق من داخل محاكي باى الرسمي");
    }
  };
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleUpdateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto" dir="rtl">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <HeroSection />
        <CategoriesSection />
        <PromoBanner />
        <FeaturedProducts
          onAddToCart={handleAddToCart}
          onProductClick={setSelectedProduct}
        />
        <ManufacturingSection />
        <DesignStudioSection />
        <PaymentMethodsSection />
        <ContactSection />
      </main>
<button 
          onClick={handlePiPayment}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] py-4 px-8 bg-purple-600 hover:purple-700 text-white font-bold rounded-full shadow-2x1 transition-all border-2 border-white text-lg"
        >
          💳 تجربة محفظة Pi
        </button>
      <BottomNav active={activeTab} onTabChange={setActiveTab} />

      <CartModal
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
