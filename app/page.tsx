'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState("جاري تجهيز الاتصال...");

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        window.Pi.init({ version: "2.0" });
        setStatus("متصل بشبكة Pi بنجاح! جاهز للتجربة.");
      } catch (err) {
        setStatus("خطأ في تهيئة الشبكة: " + err.message);
      }
    } else {
      setStatus("من فضلك افتح الصفحة من داخل Pi Browser حصرًا.");
    }
  }, []);

  const handleTestPayment = async () => {
    if (!window.Pi) return alert("الرجاء تشغيل التطبيق من متصفح Pi");
    
    setStatus("جاري إنشاء معاملة تجريبية...");
    try {
      const payment = await window.Pi.createPayment({
        amount: 1,
        memo: "Test Payment for Validation",
        metadata: { orderId: "validation-123" },
        uid: "test-user-uid"
      }, {
        onReadyForServerApproval: (paymentId) => {
          setStatus("تمت المعاملة! كود الموافقة: " + paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          setStatus("اكتملت المعاملة بنجاح! كود المعاملة: " + txid);
        },
        onCancel: (paymentId) => {
          setStatus("تم إلغاء المعاملة من قِبلك.");
        },
        onError: (error, payment) => {
          setStatus("حدث خطأ أثناء الدفع: " + error.message);
        }
      });
    } catch (error) {
      setStatus("فشل بدء المعاملة: " + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#5b21b6' }}>بوابة توثيق تطبيق Pi</h1>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{status}</p>
      
      <button onClick={handleTestPayment} style={{ marginTop: '20px', padding: '15px 30px', fontSize: '18px', color: '#fff', backgroundColor: '#eab308', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
        اضغط هنا لإجراء دفع تجريبي (1 Pi)
      </button>
    </div>
  );
}