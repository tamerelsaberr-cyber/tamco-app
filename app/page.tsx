"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Pi: any;
  }
}

export default function TamcoMainPage() {
  const [sdkStatus, setSdkStatus] = useState("Checking Pi...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initPi = async () => {
      if (typeof window !== "undefined") {
        if (window.Pi) {
          try {
            window.Pi.init({ version: "2.0", sandbox: true });
            const onIncompletePaymentFound = (payment: any) => {
              console.log("Incomplete payment", payment);
            };
            const auth = await window.Pi.authenticate(['payments', 'username'], onIncompletePaymentFound);
            console.log("Auth:", auth);
            setSdkStatus("Connected to Pi Network");
          } catch (err) {
            console.log("Auth error:", err);
            setSdkStatus("Initialization error");
          }
        } else {
          setSdkStatus("Please open in Pi Browser");
        }
      }
    };
    initPi();
  }, []);

  const handlePayment = async () => {
    if (typeof window === "undefined" || !window.Pi) {
      alert("Please open this app inside Pi Browser");
      return;
    }

    setLoading(true);
    try {
      const payment = await window.Pi.createPayment({
        amount: 1,
        memo: "Tamco Payment",
        metadata: { orderId: "tamco-1" },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("Ready for approval:", paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("Ready for completion:", paymentId, txid);
          setLoading(false);
          alert("Payment Successful!");
        },
        onCancel: (paymentId: string) => {
          console.log("Cancelled:", paymentId);
          setLoading(false);
        },
        onError: (error: any, payment: any) => {
          console.log("Payment error:", error);
          setLoading(false);
        },
      });
      console.log(payment);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>TAMCO</h1>
      <p>Status: {sdkStatus}</p>
      <p>Price: 1 Pi</p>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "15px 30px",
          fontSize: 18,
          background: "#6d28d9",
          color: "white",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
          opacity: loading ? 0.5 : 1
        }}
      >
        {loading ? "Processing..." : "Pay with Pi"}
      </button>
    </div>
  );
}