"use client";
import { useState } from "react";

export default function TamcoPage() {
  const [status, setStatus] = useState("");

  const handlePay = async () => {
    const Pi = (window as any).Pi;
    if (!Pi) return alert("افتح الموقع من Pi Browser");

    try {
      setStatus("Processing Payment...");

      // انت 0.005 / الزبون 10
      const isOwner = window.confirm(
        "هل انت صاحب المتجر؟\nOK = انت (0.005 Pi)\nCancel = زبون (10 Pi)"
      );
      const finalAmount = isOwner ? 0.005 : 10;

      setStatus(`Paying ${finalAmount} Pi...`);

      await Pi.createPayment(
        {
          amount: finalAmount,
          memo: "TAMCO Product",
          metadata: { product: "TAMCO-001", price: finalAmount },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("Completing...");
            await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            setStatus(`✅ تم الدفع بنجاح ${finalAmount} Pi - TxID: ${txid}`);
          },
          onCancel: () => setStatus("❌ تم الغاء الدفع"),
          onError: (error: any) => {
            console.log(error);
            setStatus("❌ حدث خطأ في الدفع");
          },
        }
      );
    } catch (err) {
      console.log(err);
      setStatus("❌ خطأ");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>TAMCO Product</h1>
      <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
        <p>Owner: 0.005 Pi / Customer: 10 Pi</p>
      </div>
      <button onClick={handlePay} style={{ marginTop: "30px", padding: "15px 30px", fontSize: "18px", background: "#8a2be2", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}>
        Pay with Pi
      </button>
      <p style={{ marginTop: "20px", color: "blue" }}>{status}</p>
    </div>
  );
}
