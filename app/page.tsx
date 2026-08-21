
'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState("...جاري التوصيل بالشبكة");

  useEffect(() => {
    // التأكد من تحميل مكتبة Pi من الـ layout
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        // تهيئة الـ SDK مع تفعيل وضع التجربة التجريبي Sandbox
        window.Pi.init({ version: "2.0", sandbox: true });
        setStatus("متصل بشبكة Pi بنجاح! جاهز للتجربة");
      } catch (err: any) {
        setStatus("خطأ في تهيئة المحفظة: " + err.message);
      }
    } else {
      setStatus("الرجاء تشغيل التطبيق من متصفح Pi Browser الرسمي ليتفعل الاتصال.");
    }
  }, []);

  const handleTestPayment = async () => {
    if (!window.Pi) {
      return alert("الرجاء تشغيل التطبيق من متصفح Pi Browser الرسمي لإجراء الدفع.");
    }

    setStatus("...جاري إنشاء معاملة تجريبية");
    
    try {
      await window.Pi.createPayment({
        amount: 1,
        memo: "Test Validation Payment",
        metadata: { orderId: "val-999" },
        uid: "test-user-uid"
      }, {
        onReadyForServerApproval: (paymentId) => {
          setStatus("تمت المعاملة! كود الموافقة: " + paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          setStatus("اكتملت المعاملة بنجاح! كود المعاملة: " + txid);
        },
        onCancel: () => {
          setStatus("تم إلغاء المعاملة.");
        },
        onError: (error) => {
          setStatus("حدث خطأ أثناء الدفع: " + error.message);
        }
      });
    } catch (error: any) {
      setStatus("فشل بدء المعاملة: " + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#5b21b6' }}>بوابة توثيق تطبيق Pi</h1>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{status}</p>
      
      <button 
        onClick={handleTestPayment} 
        style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#5b21b6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        اضغط هنا لإجراء دفع تجريبي (1 Pi)
      </button>
    </div>
  );
}