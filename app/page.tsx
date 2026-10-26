// @ts-nocheck
"use client";
import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("");

  const handlePay = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        setStatus("❌ لازم تفتح الموقع من Pi Browser");
        return;
      }

      Pi.init({ version: "2.0", sandbox: true });

      await Pi.authenticate(["username", "payments"], (payment: any) => {
        console.log("incomplete payment", payment);
      });

      const isOwner = window.confirm("هل انت صاحب المتجر؟\nOK = انت صاحب (0.005 Pi)\nCancel = انت زبون (10 Pi)");
      const amount = isOwner ? 0.005 : 10;

      setStatus(`جاري دفع ${amount} Pi ...`);

      await Pi.createPayment(
        {
          amount: amount,
          memo: "TAMCO Product",
          metadata: { product: "TAMCO-001", price: amount },
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            console.log("approval", paymentId);
            setStatus(`✅ تمت الموافقة - ${amount} Pi - في انتظار التأكيد`);
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            console.log("completed", paymentId, txid);
            setStatus(`✅ تم الدفع بنجاح ${amount} Pi`);
          },
          onCancel: (paymentId: string) => {
            setStatus("❌ تم إلغاء الدفع");
          },
          onError: (error: any, payment: any) => {
            console.error(error);
            setStatus(`❌ خطأ: ${error.message}`);
          },
        }
      );
    } catch (e: any) {
      console.error(e);
      setStatus(`❌ خطأ: ${e.message}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 32, fontWeight: "bold" }}>TAMCO Product</h1>
      <p style={{ margin: "10px 0 20px", color: "#666" }}>Owner: 0.005 Pi | Customer: 10 Pi</p>
      
      <button
        onClick={handlePay}
        style={{ background: "#6c4eff", color: "white", padding: "15px 35px", borderRadius: 12, border: "none", fontSize: 20, fontWeight: "bold", cursor: "pointer" }}
      >
        Pay with Pi
      </button>

      <p style={{ marginTop: 20, fontWeight: "bold", minHeight: 24 }}>{status}</p>
    </div>
  );
}