"use client";
import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("");

  const handlePay = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        setStatus("❌ افتح من Pi Browser");
        return;
      }

      await Pi.authenticate(["username", "payments"], (p: any) => {
        console.log("Incomplete payment:", p);
      });

      const isOwner = window.confirm("هل انت صاحب المتجر؟");
      const amount = isOwner ? 0.005 : 10;

      setStatus(`جاري دفع ${amount} Pi...`);

      await Pi.createPayment(
        {
          amount: amount,
          memo: "TAMCO Product",
          metadata: { price: amount },
        },
        {
          onReadyForServerApproval: async (id: string) => {
            setStatus(`✅ تمت الموافقة على ${id}`);
            await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: id }),
            });
          },
          onReadyForServerCompletion: async (id: string, txid: string) => {
            setStatus(`✅ تم الدفع بنجاح ${amount} Pi`);
            await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: id, txid }),
            });
            setTimeout(() => {
              window.location.href = "/admin";
            }, 1000);
          },
          onCancel: () => setStatus("❌ تم إلغاء الدفع"),
          onError: (e: any) => {
            console.error(e);
            setStatus(`❌ خطأ: ${e.message}`);
          },
        }
      );
    } catch (e: any) {
      setStatus(`❌ خطأ: ${e.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <h2>TAMCO Product</h2>
      <p>Owner: 0.005 / Customer: 10 Pi</p>
      <button onClick={handlePay} style={{ background: "#6c4cff", color: "white", padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer" }}>
        Pay with Pi
      </button>
      <p>{status}</p>
    </div>
  );
}