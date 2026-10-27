"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Pi: any;
  }
}

export default function Page() {
  const [piUser, setPiUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. تهيئة الـ SDK
  useEffect(() => {
    const initPi = async () => {
      if (typeof window !== "undefined" && window.Pi) {
        try {
          await window.Pi.init({ version: "2.0", sandbox: true });
          console.log("Pi SDK Initialized");
        } catch (e) {
          console.error("Pi init failed", e);
        }
      }
    };
    // نستنى ثانية لحد ما Pi script يحمل
    const timer = setTimeout(initPi, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async () => {
    try {
      const Pi = window.Pi;
      if (!Pi) throw new Error("Pi SDK not found");
      const scopes = ["username", "payments"];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      setPiUser(auth.user);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onIncompletePaymentFound = (payment: any) => {
    console.log("incomplete payment found", payment);
  };

  const handlePay = async () => {
    setError("");
    setLoading(true);
    try {
      const Pi = window.Pi;
      if (!Pi) throw new Error("Pi SDK not loaded");

      // اتأكد انه اتعمله init
      try {
        await Pi.init({ version: "2.0", sandbox: true });
      } catch {}

      const username = piUser?.username || "guest";
      const isOwner = username.toLowerCase().includes("helal");
      const amount = isOwner ? 0.005 : 10;

      await Pi.createPayment(
        {
          amount: amount,
          memo: "TAMCO Product",
          metadata: { username },
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
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            if (res.ok) {
              alert("Payment Successful! ✅");
            }
          },
          onCancel: () => {
            setError("Payment Cancelled");
            setLoading(false);
          },
          onError: (err: any) => {
            setError("Payment Error: " + err.message);
            setLoading(false);
          },
        }
      );
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "serif" }}>
      <h1>TAMCO Product</h1>
      <p>Owner: 0.005 / Customer: 10 Pi</p>
      {!piUser ? (
        <button onClick={handleAuth} style={{ padding: "10px 20px" }}>
          Login with Pi
        </button>
      ) : (
        <button onClick={handlePay} style={{ padding: "10px 20px" }}>
          Pay with Pi
        </button>
      )}
      {error && <p style={{ color: "red", marginTop: "20px" }}>Error: {error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
}
