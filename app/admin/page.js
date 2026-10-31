"use client";

import { useState, useEffect } from 'react';

export default function TamcoAdminPanel() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); 
  const [editingId, setEditingId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('الكل');

  const categories = ['الكل', 'أثاث منزلي', 'أثاث مكتبي', 'الديكور'];

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('tamco_real_products');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  const saveToStorage = (list) => {
    setProducts(list);
    localStorage.setItem('tamco_real_products', JSON.stringify(list));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !category) return alert('الرجاء ملء الحقول الأساسية');

    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...p, title, price, discountPrice, category, description, image } : p);
      saveToStorage(updated);
      setEditingId(null);
      alert('تم التعديل بنجاح');
    } else {
      const newProd = { id: Date.now(), title, price, discountPrice, category, description, image };
      saveToStorage([newProd, ...products]);
      alert('تم النشر بنجاح');
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setDiscountPrice('');
    setCategory('');
    setDescription('');
    setImage('');
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setPrice(p.price);
    setDiscountPrice(p.discountPrice || '');
    setCategory(p.category);
    setDescription(p.description || '');
    setImage(p.image || '');
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من الحذف؟')) {
      saveToStorage(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = activeTab === 'الكل' ? products : products.filter(p => p.category === activeTab);

  if (!isMounted) return null;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'sans-serif', backgroundColor: '#fdfbfa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#4a3b32', fontSize: '22px' }}>لوحة التحكم - إدارة المنتجات</h1>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          
          {/* نموذج الإدخال */}
          <div style={{ flex: '1 1 350px', backgroundColor: '#fdfbfa', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3>{editingId ? '🛠️ تعديل المنتج' : '➕ إضافة منتج'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="اسم قطعة الأثاث" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} required />
              <input type="number" placeholder="السعر الأساسي (ر.س)" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} required />
              <input type="number" placeholder="السعر بعد الخصم (ر.س)" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} style={inputStyle} />
              
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} required>
                <option value="">-- اختر القسم --</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <textarea placeholder="المواصفات والأبعاد" value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'none' }}></textarea>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '13px' }}>صورة المنتج:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }} 
                  style={{ ...inputStyle, padding: '6px' }} 
                />
                {image && (
                  <div style={{ textAlign: 'center' }}>
                    <img src={image} alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                  </div>
                )}
              </div>

              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4a3b32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                {editingId ? 'حفظ التعديلات' : 'نشر المنتج'}
              </button>
            </form>
          </div>

          {/* الجدول على اليسار */}
          <div style={{ flex: '1.5 1 450px', backgroundColor: '#fff', padding: '10px' }}>
            <h3>📊 المنتجات الحالية ({products.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#fbf9f8', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '6px' }}>الصورة</th>
                  <th style={{ padding: '6px' }}>الاسم</th>
                  <th style={{ padding: '6px' }}>القسم</th>
                  <th style={{ padding: '6px' }}>السعر</th>
                  <th style={{ padding: '6px' }}>التحكم</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0e6da' }}>
                    <td style={{ padding: '6px' }}>
                      {p.image ? <img src={p.image} alt="" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} /> : <div style={{ width: '35px', height: '35px', backgroundColor: '#eee' }}></div>}
                    </td>
                    <td style={{ padding: '6px' }}>{p.title}</td>
                    <td style={{ padding: '6px' }}>{p.category}</td>
                    <td style={{ padding: '6px' }}>{p.price} ر.س</td>
                    <td style={{ padding: '6px' }}>
                      <button onClick={() => handleEdit(p)} style={{ marginLeft: '4px' }}>تعديل</button>
                      <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* محاكاة تطبيق الفون Pi Browser */}
        <div style={{ maxWidth: '360px', margin: '40px auto 0 auto', border: '6px solid #333', borderRadius: '15px', padding: '10px' }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '16px' }}>TAMCO</h2>
          </div>

          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginBottom: '10px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)} style={{ padding: '4px 10px', borderRadius: '10px', border: 'none', background: activeTab === cat ? '#4a3b32' : '#f5f5f5', color: activeTab === cat ? '#fff' : '#333', fontSize: '11px' }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {filteredProducts.map(p => (
              <div key={p.id} style={{ border: '1px solid #f0e6da', padding: '6px', borderRadius: '6px' }}>
                <div style={{ height: '70px', background: '#fdfbfa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <small style={{ color: '#ccc' }}>لا توجد صورة</small>}
                </div>
                <h5 style={{ margin: '4px 0 2px 0', fontSize: '11px' }}>{p.title}</h5>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#8e44ad' }}>{p.price} ر.س</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '8px',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  boxSizing: 'border-box',
  textAlign: 'right',
  direction: 'rtl'
};