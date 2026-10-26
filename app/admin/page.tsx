'use client';
import { useState } from 'react';
import { ADMIN_CONFIG } from './config';
import AuthGate from './components/AuthGate';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [image, setImage] = useState('');
  const [country, setCountry] = useState('EG');
  const [vendorType, setVendorType] = useState<'PI' | 'FIAT'>('PI');

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name || !price || !image) {
      alert('⚠️ املى اسم المنتج وسعر البيع والصورة');
      return;
    }

    const priceNum = parseFloat(price);
    const costNum = parseFloat(cost) || 0;
    const profit = priceNum - costNum;

    // القاعدة اللي اتفقنا عليها
    // Pi مشترك: Pi يدفع 50% Pi + 50% بعملة بلده - التاجر ياخد 50% Pi + 50% بلده
    // خارجي: يدفع 100% بعملة بلده فقط
    const piAmount = vendorType === 'PI' ? priceNum * 0.5 : 0;
    const fiatAmount = vendorType === 'PI' ? priceNum * 0.5 : priceNum;

    // توزيع الربح 70% متجر / 30% شبكة
    const storeShare = profit * 0.7;
    const networkShare = profit * 0.3;

    const newProduct = {
      id: Date.now(),
      name,
      price: priceNum,
      cost: costNum,
      profit,
      image,
      wallet: ADMIN_CONFIG.wallet,
      piNetwork: { sdk: 'Pi SDK 2.0', isBase: true, title: 'Pi هو الأساس' },
      design: { theme: 'فرعوني', gold: '#D4AF37', black: '#111' },
      vendorType,
      country,
      fiatCurrency: country,
      distribution: {
        pi: piAmount,
        fiat: fiatAmount,
        rule: vendorType === 'PI' ? '50% Pi + 50% بلده' : '100% بلده',
      },
      feeDistribution: {
        store: '70%',
        storeValue: storeShare,
        network: '30%',
        networkValue: networkShare,
      },
      createdAt: new Date().toISOString(),
    };

    const products = JSON.parse(localStorage.getItem('tamco_products') || '[]');
    products.push(newProduct);
    localStorage.setItem('tamco_products', JSON.stringify(products));

    alert(`✅ تم الحفظ في محفظة ${ADMIN_CONFIG.wallet}
المنتج: ${name}
النوع: ${vendorType === 'PI' ? 'Pi مشترك - Pi ياخد + بلده' : 'خارجي - ياخد بلده فقط'}
الربح: ${profit} مقسم 70% متجر / 30% شبكة`);

    setName('');
    setPrice('');
    setCost('');
    setImage('');
  };

  return (
    <AuthGate>
      <div style={{ padding: 20, maxWidth: 700, margin: '0 auto', background: '#111', color: 'white', minHeight: '100vh' }}>
        <h1 style={{ color: '#D4AF37', borderBottom: '2px solid #D4AF37', paddingBottom: 10 }}>
          TAMCO - لوحة تحكم Pi هو الأساس
        </h1>

        <div style={{ border: '1px dashed #D4AF37', padding: 12, marginTop: 15, fontSize: 11, wordBreak: 'break-all', background: '#1a1a1a' }}>
          <p>🔹 Pi هو الأساس - متجر الـ Pi مع Pi SDK 2.0</p>
          <p>🔹 محفظة التطبيق: {ADMIN_CONFIG.wallet} - Pi هو الأساس</p>
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>📸 صورة المنتج:</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {image && <img src={image} style={{ width: 200, border: '2px solid #D4AF37', borderRadius: 8 }} alt="preview" />}

          <label>🏷️ اسم المنتج:</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="اسم المنتج" style={{ padding: 10, color: 'black', borderRadius: 4 }} />

          <label>💰 سعر البيع Pi:</label>
          <input type="number" step="0.1" value={price} onChange={e => setPrice(e.target.value)} placeholder="مثال: 1.5" style={{ padding: 10, color: 'black', borderRadius: 4 }} />

          <label>💸 تكلفة المنتج:</label>
          <input type="number" step="0.1" value={cost} onChange={e => setCost(e.target.value)} placeholder="مثال: 0.5" style={{ padding: 10, color: 'black', borderRadius: 4 }} />

          <label>🌍 عملة بلد التاجر:</label>
          <select value={country} onChange={e => setCountry(e.target.value)} style={{ padding: 10, color: 'black', borderRadius: 4 }}>
            <option value="EG">EGP - جنيه مصري</option>
            <option value="SA">SAR - ريال سعودي</option>
            <option value="AE">AED - درهم اماراتي</option>
            <option value="US">USD - دولار</option>
          </select>

          <label>📦 نوع المعرض / البازار:</label>
          <select value={vendorType} onChange={e => setVendorType(e.target.value as any)} style={{ padding: 10, color: 'black', borderRadius: 4 }}>
            <option value="PI">✅ مشترك في Pi - 50% Pi + 50% بلده</option>
            <option value="FIAT">🏪 معرض خارجي - ياخد 100% بعملة بلده فقط</option>
          </select>

          <div style={{ border: '1px dashed #D4AF37', padding: 10, fontSize: 12, background: '#222' }}>
            <p>🔹 Pi مشترك: Pi الزبون يدفع Pi + ياخد التاجر 50% Pi + 50% بلده</p>
            <p>🔹 خارجي: الزبون يدفع فيات → التاجر ياخد فيات بس</p>
            <p>🔹 الربح: 70% للمتجر / 30% للشبكة - كله مربوط بـ {ADMIN_CONFIG.wallet.slice(0,4)}...</p>
          </div>

          <button onClick={handleSave} style={{ background: '#D4AF37', color: 'black', padding: 14, fontWeight: 'bold', width: '100%', borderRadius: 6, cursor: 'pointer', marginTop: 5 }}>
            ✅ حفظ في {ADMIN_CONFIG.wallet.slice(0,8)} - Pi هو الأساس
          </button>

          <button onClick={() => window.location.href='/'} style={{ border: '1px solid #888', padding: 10, width: '100%', borderRadius: 6, background: 'transparent', color: 'white', cursor: 'pointer' }}>
            ← العودة للمتجر
          </button>
        </div>
      </div>
    </AuthGate>
  );
}
