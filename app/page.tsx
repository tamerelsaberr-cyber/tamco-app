// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [status, setStatus] = useState("");

  // ده اللي كان ناقص - نعمل init أول ما الصفحة تفتح
  useEffect(() => {
    const interval = setInterval(() => {
      const Pi = (window as any).Pi;
      if (Pi) {
        Pi.init({ version: "2.0" });
        console.log("Pi SDK Initialized");
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handlePay = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        setStatus("❌ افتح من Pi Browser");
        return;
      }

      // مش هنعمل init هنا تاني - خلاص اتعمل فوق

      await Pi.authenticate(["username", "payments"], (p: any) => {
        console.log("Incomplete payment:", p);
      });

      const isOwner = window.confirm("هل انت صاحب المتجر؟\nOK = 0.005 Pi\nCancel = 10 Pi");
      const amount = isOwner ? 0.005 : 10;

      setStatus(`جاري دفع ${amount} Pi...`);

      await Pi.createPayment(
        {
          amount: amount,
          memo: "TAMCO Product",
          metadata: { price: amount },
        },
        {
          onReadyForServerApproval: (id: string) => {
            setStatus(`✅ تمت الموافقة على ${amount} Pi`);
            console.log("APPROVAL ID:", id);
          },
          onReadyForServerCompletion: (id: string, txid: string) => {
            setStatus(`✅ تم الدفع بنجاح ${amount} Pi`);
          },
          onCancel: () => setStatus("❌ تم الإلغاء"),
          onError: (e: any) => {
            console.error(e);
            setStatus(`❌ خطأ: ${e.message}`);
          },
        }
      );
    } catch (e: any) {
      console.error(e);
      setStatus(`❌ خطأ: ${e.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <h1>TAMCO Product</h1>
      <p>Owner: 0.005 / Customer: 10 Pi</p>
      <button onClick={handlePay} style={{ background: "#6c4eff", color: "white", padding: "15px 30px", borderRadius: 10, border: "none", fontSize: 18 }}>
        Pay with Pi
      </button>
      <p>{status}</p>
    </div>
  );
}