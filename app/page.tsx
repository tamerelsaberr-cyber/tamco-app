"use client";
import { useState, useEffect } from "react";

export default function TamcoPage() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("Loading...");
  const [paid, setPaid] = useState(false);
  const [txid, setTxid] = useState("");

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && (window as any).Pi) {
        const Pi = (window as any).Pi;
        Pi.init({ version: "2.0", sandbox: true });
        try {
          const auth = await Pi.authenticate(["username", "payments"], () => {});
          setUser(auth.user);
          setStatus("Connected");
        } catch {
          setStatus("Open in Pi Browser");
        }
      }
    };
    init();
  }, []);

  const handlePay = async () => {
    const Pi = (window as any).Pi;
    if (!Pi) return alert("Open in Pi Browser");
    try {
      setStatus("Processing Payment...");
      await Pi.createPayment({
        amount: 1,
        memo: "TAMCO Product",
        metadata: { product: "TAMCO-001" }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch("/api/pi/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId })
          });
        },
        onReadyForServerCompletion: async (paymentId: string, tId: string) => {
          setTxid(tId);
          await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid: tId })
          });
          setPaid(true);
          setStatus("Payment Successful!");
        },
        onCancel: () => setStatus("Cancelled"),
        onError: (e: any) => setStatus("Error: " + e.message)
      });
    } catch (e: any) {
      setStatus("Error: " + e.message);
    }
  };

  // === لو دفع خلاص - دي صفحة الأرباح ===
  if (paid) {
    return (
      <div style={{ background: "#0a0a0a", color: "white", minHeight: "100vh", padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", color: "#22c55e" }}>✅ Payment Successful!</h1>
        <p style={{ marginTop: 10 }}>Welcome, {user?.username}</p>
        <div style={{ background: "#1a1a1a", maxWidth: 400, margin: "30px auto", padding: 20, borderRadius: 12, textAlign: "left" }}>
          <p><b>Product:</b> TAMCO Product</p>
          <p><b>Amount:</b> 1 Pi</p>
          <p style={{ fontSize: 12, wordBreak: "break-all", marginTop: 10 }}>
            <b>Received to Wallet:</b><br/>
            {process.env.NEXT_PUBLIC_PI_WALLET_ADDRESS}
          </p>
          <p style={{ fontSize: 12, marginTop: 10 }}><b>TxID:</b> {txid.slice(0,20)}...</p>
          <p style={{ color: "#22c55e", marginTop: 15, fontWeight: "bold" }}>تم تسجيل الربح في المحفظة GBBV - هذه هي صفحة الأرباح</p>
        </div>
        <p style={{ fontSize: 12, color: "#888" }}>{status}</p>
      </div>
    );
  }

  // === لو لسه مدفعش ===
  return (
    <div style={{ background: "#0a0a0a", color: "white", minHeight: "100vh", padding: "40px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: 32, letterSpacing: 2 }}>TAMCO</h1>
      <p style={{ marginTop: 10 }}>{status}</p>
      {user && <p>Welcome, {user.username}</p>}
      <div style={{ marginTop: 40 }}>
        <h2>TAMCO Product</h2>
        <p style={{ marginTop: 10, fontSize: 20 }}>Price: 1 Pi</p>
        <button onClick={handlePay} style={{ marginTop: 20, background: "#6366f1", color: "white", padding: "12px 40px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 16 }}>
          Pay with Pi
        </button>
      </div>
    </div>
  );
}