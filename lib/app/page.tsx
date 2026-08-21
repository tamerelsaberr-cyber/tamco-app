"use client";

import { useState } from "react";
import { Header } from "@/components/tamco/header";
import { HeroSection } from "@/components/tamco/hero-section";
import { CategoriesSection } from "@/components/tamco/categories-section";
import { PromoBanner } from "@/components/tamco/promo-banner";
import { FeaturedProducts } from "@/components/tamco/featured-products";
import { ManufacturingSection } from "@/components/tamco/manufacturing-section";
import { DesignStudioSection } from "@/components/tamco/design-studio";
import { PaymentMethodsSection } from "@/components/tamco/payment-methods";
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
    if (!(window as any).Pi) {
      return alert("الرجاء فتح التطبيق من داخل محاكي باي الرسمي (Pi Browser)");
    }

    try {
      (window as any).Pi.createPayment({
        amount: 0.1,
        memo: "تجربة دفع من واجهة تامو الرئيسية",
        metadata: { orderId: "999" }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          const response = await fetch('/api/pi-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, action: 'approve' })
          });

          if (response.ok) {
            (window as any).Pi.approvePayment(paymentId);
          } else {
            console.error("فشلت موافقة السيرفر الداخلي");
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          const response = await fetch('/api/pi-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid, action: 'complete' })
          });

          if (response.ok) {
            alert("تم توثيق واكتمال المعاملة بنجاح!");
          } else {
            alert("فشل التوثيق النهائي على السيرفر");
          }
        },
        onCancel: (paymentId: string) => {
          console.log("Cancelled paymentId:", paymentId);
        },
        onError: (error: Error, paymentId?: string) => {
          console.error("Error:", error, paymentId);
        }
      });
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen bg-background max-w-md mx-auto" style={{ direction: "rtl" }}>
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      
      <main>
        <HeroSection />
        <CategoriesSection />
        <PromoBanner />
        <FeaturedProducts 
          onAddToCart={handleAddToCart} 
          onProductClick={(p) => setSelectedProduct(p)} 
        />
        <ManufacturingSection />
        <DesignStudioSection />
        <PaymentMethodsSection />
        <ContactSection />
      </main>

      <button 
        onClick={handlePiPayment} 
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] py-2 px-4 bg-yellow-500 text-black rounded font-bold"
      >
        تجربة محفظة Pi
      </button>

      <BottomNav active={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

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