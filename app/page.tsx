"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const Pi = (window as any).Pi;
    if (Pi) {
      Pi.init({ version: "2.0", sandbox: true });
    }
  }, []);

  const handlePay = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        setStatus("❌ افتح من Pi Browser");
        return;
      }

      const auth = await Pi.authenticate(["username", "payments"], (p: any) => {
        console.log(p);
      });

      setStatus(`✅ اهلا ${auth.user.username}`);

      const isOwner = window.confirm("هل انت صاحب المتجر؟");
      const amount = isOwner ? 0.005 : 10;

      await Pi.createPayment({
        amount: amount,
        memo: "Tamco Product",
        metadata: { productId: "1" },
      }, {
        onReadyForServerApproval: (id: string) => {
          setStatus("جاري الموافقة... " + id);
        },
        onReadyForServerCompletion: (id: string, txid: string) => {
          setStatus("✅ تم الدفع بنجاح");
        },
        onCancel: () => setStatus("تم الالغاء"),
        onError: (e: any) => setStatus("خطأ: " + e.message),
      });

    } catch (e: any) {
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>TAMCO Product</h1>
      <p>Owner: 0.005 / Customer: 10 Pi</p>
      <button onClick={handlePay} style={{ padding: "10px 20px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8 }}>
        Pay with Pi
      </button>
      <p>{status}</p>
    </div>
  );
}