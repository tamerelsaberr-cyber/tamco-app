"use client";
import { useEffect, useState } from "react";

declare global { interface Window { Pi: any } }

export default function TamcoPage() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("Checking Pi...");

  useEffect(() => {
    const initPi = async () => {
      if (typeof window !== "undefined" && (window as any).Pi) {
        const Pi = (window as any).Pi;
        Pi.init({ version: "2.0", sandbox: true });
        try {
          const auth = await Pi.authenticate(["username", "payments"], () => {});
          setUser(auth.user);
          setStatus("Connected to Pi Network");
        } catch {
          setStatus("Please open in Pi Browser");
        }
      }
    };
    initPi();
  }, []);

  const handlePay = async () => {
    if (!(window as any).Pi) return alert("Open in Pi Browser");
    try {
      setStatus("Processing...");
      await (window as any).Pi.createPayment({
        amount: 1,
        memo: "TAMCO Order",
        metadata: { orderId: "TAMCO-001" },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch("/api/pi/approve", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ paymentId }) });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          await fetch("/api/pi/complete", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ paymentId, txid }) });
          setStatus("Payment Successful!");
        },
        onCancel: () => setStatus("Payment Cancelled"),
        onError: (err: any) => setStatus("Error: " + err.message),
      });
    } catch (e: any) { setStatus("Error: " + e.message); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "sans-serif", padding: 20, textAlign: "center" }}>
      <h1 style={{ fontSize: 48 }}>TAMCO</h1>
      <p style={{ color: "#aaa" }}>{status}</p>
      {user && <p>Welcome, {user.username}</p>}

      <div style={{ maxWidth: 500, margin: "30px auto", background: "#1a1a1a", padding: 30, borderRadius: 16 }}>
        <h2>TAMCO Product</h2>
        <p style={{ fontSize: 24, fontWeight: "bold" }}>Price: 1 Pi</p>
        <button onClick={handlePay} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 12, fontSize: 18, cursor: "pointer", width: "100%" }}>
          Pay with Pi
        </button>
      </div>
    </div>
  );
}