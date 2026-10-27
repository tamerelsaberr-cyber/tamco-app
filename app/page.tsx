"use client";
import { useState, useEffect } from "react";

declare global { interface Window { Pi: any } }

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.onload = () => { window.Pi.init({ version: "2.0", sandbox: true }); };
    document.body.appendChild(script);
  }, []);

  const login = async () => {
    try {
      const scopes = ["username", "payments"];
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setUser(auth.user);
    } catch (e) { alert("Login failed"); }
  };

  const onIncompletePaymentFound = (payment: any) => {
    console.log("incomplete", payment);
    return fetch("/api/pi/complete", {
      method: "POST",
      body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction?.txid }),
      headers: { "Content-Type": "application/json" }
    });
  };

  const pay = async () => {
    setLoading(true);
    try {
      await window.Pi.createPayment({
        amount: 1, // 1 Pi زي ما كنت عايز
        memo: "TAMCO Product",
        metadata: { productId: "tamco-1" }
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          fetch("/api/pi/approve", {
            method: "POST",
            body: JSON.stringify({ paymentId }),
            headers: { "Content-Type": "application/json" }
          });
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          fetch("/api/pi/complete", {
            method: "POST",
            body: JSON.stringify({ paymentId, txid }),
            headers: { "Content-Type": "application/json" }
          }).then(() => {
            setLoading(false);
            alert("تم الدفع بنجاح! 1 Pi");
          });
        },
        onCancel: () => { setLoading(false); },
        onError: (err: any) => { setLoading(false); console.log(err); alert("فشل الدفع"); }
      });
    } catch (e) { setLoading(false); }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>TAMCO Product</h1>
      {!user ? (
        <button onClick={login} style={{ padding: "15px 30px" }}>Login with Pi</button>
      ) : (
        <>
          <p>أهلا {user.username}</p>
          <button onClick={pay} style={{ padding: "15px 30px", background: "purple", color: "white" }}>
            {loading ? "جاري..." : "Pay 1 Pi"}
          </button>
        </>
      )}
    </div>
  );
}