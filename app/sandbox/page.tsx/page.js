"use client";

import { useState, useEffect } from 'react';

export default function TamcoMainStoreView() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('الكل');
  const [isMounted, setIsMounted] = useState(false);

  const categories = ['الكل', 'أثاث مكتبي', 'أثاث منزلي', 'ديكور'];
useEffect(() => {
    setIsMounted(true);
    
    // فحص المفتاحين لضمان جلب البيانات من لوحة الأدمن مهما كان اسم المفتاح المستخدم
    const saved = localStorage.getItem('tamco_real_products') || localStorage.getItem('tamco_clean_products');
    
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse products from local storage", error);
      }
    }
  }, []);

  // تصفية المنتجات حسب القسم المختار
  const filteredProducts = activeTab === 'الكل' ? products : products.filter(p => p.category === activeTab);

  if (!isMounted) return null;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'sans-serif', backgroundColor: '#fcfaf7', minHeight: '100vh', padding: '20px' }}>
      
      {/* واجهة العرض العلوية */}
      <header style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #e3dac9', paddingBottom: '15px' }}>
        <h1 style={{ color: '#4A3B32', fontSize: '26px', margin: '0 0 5px 0' }}>تطبيق تامكو للأثاث</h1>
        <p style={{ color: '#7a6a5f', margin: 0, fontSize: '14px' }}>عرض المنتجات والأسعار المضافة الحية</p>
      </header>

      {/* تصنيفات الأقسام */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '25px', paddingBottom: '5px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1px solid #4A3B32',
              backgroundColor: activeTab === cat ? '#4A3B32' : 'white',
              color: activeTab === cat ? 'white' : '#4A3B32',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* شبكة عرض المنتجات المستدعاة */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a6a5f', border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
          لا توجد منتجات مسعرة معروضة حالياً. أضف منتجات جديدة من لوحة الأدمن لتظهر هنا تلقائياً.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {filteredProducts.map(p => (
            <div key={p.id} style={{ border: '1px solid #f0e6da', padding: '12px', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              
              {p.image ? (
                <img src={p.image} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <div style={{ width: '100%', height: '140px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '13px' }}>بدون صورة</div>
              )}

              <h3 style={{ margin: '12px 0 6px 0', fontSize: '15px', color: '#333', fontWeight: 'bold' }}>{p.title}</h3>
              {p.description && <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666', height: '32px', overflow: 'hidden' }}>{p.description}</p>}
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #fdfbf9' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#4A3B32', fontWeight: 'bold', fontSize: '16px' }}>{p.price} Pi</span>
                  {p.discountPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '12px' }}>{p.discountPrice} Pi</span>}
                </div>
                <span style={{ fontSize: '12px', color: '#7a6a5f', backgroundColor: '#f5eae0', padding: '4px 8px', borderRadius: '4px' }}>
                  {p.category}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}