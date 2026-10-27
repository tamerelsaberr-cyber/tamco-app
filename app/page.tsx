"use client";
import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("");

  const handlePay = async () => {
    try {
      // @ts-ignore
      const Pi = window.Pi;
      if (!Pi) {
        setStatus("افتح في Pi Browser");
        return;
      }
      const auth = await Pi.authenticate(["username", "payments"], () => {});
      const isOwner = auth.user.username === "Helal_90";
      const amount = isOwner ? 0.005 : 10;
      setStatus("جاري فتح الدفع...");
      // @ts-ignore
      await Pi.createPayment({
        amount: amount,
        memo: "TAMCO Product",
        metadata: { productId: "1" },
      }, {
        onReadyForServerApproval: async (id: string) => {
          setStatus("⏳ جاري الموافقة... " + id);
          await fetch("/api/pi/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: id }),
          });
        },
        onReadyForServerCompletion: async (id: string, txid: string) => {
          setStatus("جاري التأكيد...");
          await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: id, txid: txid }),
          });
          setStatus("✅ تم الدفع بنجاح");
        },
        onCancel: (id: string) => { setStatus("تم الالغاء " + id); },
        onError: (e: any) => { setStatus("خطأ: " + e.message); },
      });
    } catch (e: any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>TAMCO Product</h1>
      <p>Owner: 0.005 / Customer: 10 Pi</p>
      <button onClick={handlePay} style={{ padding: "10px 20px", fontSize: 18 }}>
        Pay with Pi
      </button>
      <p>{status}</p>
    </div>
  );
}