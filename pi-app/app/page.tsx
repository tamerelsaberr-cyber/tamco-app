
'use client';
import React, { useState } from 'react';

export default function AdminPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', direction: 'rtl', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#5b21b6', marginBottom: '20px', textAlign: 'center' }}>🔐 لوحة تحكم الأدمن (Tamco Clean)</h1>
        <p style={{ fontSize: '18px', color: '#4b5563', lineHeight: '1.6', textAlign: 'center' }}>
          مرحباً بك يا صديقي في لوحة التحكم. التطبيق الآن متصل بالسيرفر المحلي بنجاح وجاهز للتوثيق والاختبار.
        </p>
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '6px', textAlign: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#059669' }}>● السيرفر نشط وجاهز لاستقبال التليفون</span>
        </div>
      </div>
    </div>
  );
}