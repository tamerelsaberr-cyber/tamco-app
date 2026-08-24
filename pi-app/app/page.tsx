
'use client';
import React, { useState } from 'react';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('جاهز لبدء عملية التوثيق والترقية');

  const handlePiPayment = async () => {
    setLoading(true);
    setStatus('جاري الاتصال بمحفظة Pi...');
    
    try {
      if (typeof window !== 'undefined' && (window as any).Pi) {
        const Pi = (window as any).Pi;
        
        await Pi.createPayment({
          amount: 1, 
          memo: "توثيق وتفعيل حساب تطبيق Tamco Clean",
          metadata: { id: "user_verification_p1" }
        }, {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus('جاري إرسال الموافقة التلقائية للمطور...');
            return paymentId; 
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus('تم التفعيل والتوثيق بنجاح! جاري التحديث...');
            window.location.reload();
          },
          onCancel: (paymentId: string) => {
            setStatus('تم إلغاء عملية الدفع من قبل المستخدم');
            setLoading(false);
          },
          onError: (error: Error, paymentId?: string) => {
            setStatus('حدث خطأ أثناء المعالجة، يرجى المحاولة لاحقاً');
            setLoading(false);
          }
        });
      } else {
        setStatus('يرجى فتح الرابط من داخل متصفح تطبيق Pi Browser الفعلي');
        setLoading(false);
      }
    } catch (err) {
      setStatus('انتهت مهلة العملية، يرجى إعادة المحاولة المباشرة');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', direction: 'rtl', textAlign: 'center', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#5b21b6', fontSize: '28px', marginBottom: '20px' }}>بوابة توثيق تطبيق Pi</h1>
        <p style={{ fontSize: '18px', color: '#4b5563', margin: '20px 0' }}>{status}</p>
        
        <button 
          onClick={handlePiPayment}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9333ea' : '#6d28d9',
            color: '#fff',
            border: 'none',
            padding: '15px 30px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold',
            transition: '0.3s'
          }}
        >
          {loading ? '... جاري معالجة التوثيق' : 'اضغط هنا لإجراء دفع تجريبي (1 Pi)'}
        </button>
      </div>
    </div>
  );
}