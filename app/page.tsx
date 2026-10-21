"use client";

import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    Pi: any;
  }
}

export default function TamcoMainPage() {
  const [loading, setLoading] = useState(false);
  const [sdkStatus, setSdkStatus] = useState("Checking Pi SDK...");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true });
          setSdkStatus("Connected to Pi Network");
        } catch (err) {
          setSdkStatus("Initialization error");
        }
      } else {
        setSdkStatus("Please open in Pi Browser");
      }
    }
  }, []);

  const handlePayment = async () => {
    if (typeof window === "undefined" || !window.Pi) {
      alert("Please open this app inside Pi Browser");
      return;
    }

    setLoading(true);
    try {
      window.Pi.createPayment({
        amount: 1,
        memo: "Tamco Pay Verification Subscription",
        recipient: GBBVIQAKX5QTI6FG6BVI2AZB6QWIJIL5V6HNTK3JLFL6HBHZY7FQLLPC,
        metadata: { appId: "tamco" }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, action: "approve" })
          });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid, action: "complete" })
          });
          alert("Verification Completed Successfully!");
          setLoading(false);
        },
        onCancel: (paymentId: string) => {
          alert("Payment Cancelled");
          setLoading(false);
        },
        onError: (error: any, paymentId: string) => {
          console.error(error);
          alert("Transaction Error");
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1 style={{ color: "#8a2be2" }}>Tamco Pay - Verification Panel</h1>
      
      <div style={{ padding: "20px", margin: "20px auto", maxWidth: "500px", borderRadius: "8px", background: "#f4f4f9", border: "1px solid #ccc" }}>
        <h3>Network Status:</h3>
        <p style={{ fontWeight: "bold", color: sdkStatus.includes("Connected") ? "green" : "orange" }}>
          {sdkStatus}
        </p>
        
        <button 
          onClick={handlePayment} 
          disabled={loading}
          style={{ padding: "12px 24px", background: "#8a2be2", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginTop: "15px" }}
        >
          {loading ? "Processing..." : "Complete Step 10 Verification (1 Pi)"}
        </button>
      </div>
    </main>
  );
}