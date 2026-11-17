"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ProductItem,
  OrderTrackingItem,
  DEFAULT_PRODUCTS,
  TRACKING_STAGES,
  INITIAL_ORDERS,
} from "./tamcoData";



export default function TamcoUnifiedApp() {
  const [tab, setTab] = useState("store");
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [isPro, setIsPro] = useState(false);
  const [msg, setMsg] = useState("");
  const [orders, setOrders] = useState<OrderTrackingItem[]>(INITIAL_ORDERS);

  const [w, setW] = useState("200");
  const [h, setH] = useState("90");
  const [d, setD] = useState("85");
  const [wood, setWood] = useState("Solid Beech");
  const [color, setColor] = useState("Warm Walnut");

  const [title, setTitle] = useState("");
  const [dims, setDims] = useState("");
  const [payMode, setPayMode] = useState("50% Split Payment");

  const [pName, setPName] = useState("");
  const [pType, setPType] = useState("Manufacturing Workshop");
  const [pSpec, setPSpec] = useState("");
  const [pDone, setPDone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tamco-products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      } catch {}
    }
    if (localStorage.getItem("tamco_3d_pro") === "true") setIsPro(true);
  }, []);

  const handleSubscribe = async () => {
    setMsg("Connecting to Pi Wallet...");
    try {
      const piSDK = (window as any).Pi;
      if (!piSDK) {
        setMsg("Open inside Pi Browser to activate subscription.");
        return;
      }
      await piSDK.authenticate(["payments"], () => {});
      const res = await piSDK.createSubscription({
        serviceId: 363,
        memo: "TAMCO 3D Studio Monthly Plan",
        metadata: { plan: "monthly", serviceId: "363" },
      });
      if (res && res.status === "active") {
        localStorage.setItem("tamco_3d_pro", "true");
        setIsPro(true);
        setMsg("3D Pro Monthly Subscription Activated!");
      }
    } catch {
      setMsg("Subscription cancelled or unavailable.");
    }
  };

  const sendToContract = () => {
    setTitle(`Custom 3D (${wood})`);
    setDims(`${w}cm x ${h}cm x ${d}cm`);
    setTab("contract");
    setMsg("3D specs transferred to contract.");
  };

  const createOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dims) return;
    const newOrd: OrderTrackingItem = {
      id: `TMC-${Math.floor(100 + Math.random() * 900)}`,
      title,
      woodType: wood,
      dimensions: dims,
      finishing: color,
      paymentPlan: payMode,
      currentStage: 1,
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-PI`,
    };
    setOrders([newOrd, ...orders]);
    setTitle("");
    setDims("");
    setTab("tracking");
    setMsg("Smart Contract created and added to tracker.");
  };

  const inp = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d5c7be" };
  const btn = { backgroundColor: "#5c3d2e", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };

  return (
    <div style={{ backgroundColor: "#fcfaf8", minHeight: "100vh", color: "#2d241e", fontFamily: "sans-serif", paddingBottom: "85px" }}>
      <header style={{ backgroundColor: "#5c3d2e", color: "#fff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px" }}>TAMCO FURNITURE & 3D</h1>
          <span style={{ fontSize: "12px", color: "#e6d7ce" }}>Manufacturing, 3D Studio & Pi Commerce</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ backgroundColor: "#065439", padding: "5px 10px", borderRadius: "16px", fontSize: "12px", fontWeight: "bold" }}>
            {isPro ? "3D PRO ACTIVE" : "TESTNET READY"}
          </span>
          <Link href="/admin" style={{ backgroundColor: "#fff", color: "#5c3d2e", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", textDecoration: "none" }}>
            Admin
          </Link>
        </div>
      </header>

      {msg && <div style={{ backgroundColor: "#065439", color: "#fff", padding: "10px", textAlign: "center", fontSize: "14px" }}>{msg}</div>}

      <main style={{ padding: "20px 16px", maxWidth: "1050px", margin: "0 auto" }}>
        {tab === "store" && (
          <div>
            <h2 style={{ color: "#5c3d2e", marginTop: 0 }}>Furniture Store & Showroom</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {products.map((p) => (
                <div key={p.id} style={{ backgroundColor: "#fff", padding: "18px", borderRadius: "12px", border: "1px solid #eadfd8" }}>
                  <div style={{ height: "120px", backgroundColor: "#f4ede8", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#5c3d2e", fontWeight: "bold", marginBottom: "10px" }}>
                    {p.category || "TAMCO"}
                  </div>
                  <h3 style={{ margin: "6px 0", fontSize: "16px" }}>{p.name}</h3>
                  <p style={{ color: "#065439", fontWeight: "bold", margin: "6px 0 12px" }}>{p.price}</p>
                  <button onClick={() => { setTitle(p.name); setDims("Standard Size"); setTab("contract"); }} style={{ ...btn, width: "100%" }}>
                    Order & Contract
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "studio" && (
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              <h2 style={{ color: "#5c3d2e", margin: 0 }}>3D Design & Preview Studio</h2>
              <button onClick={handleSubscribe} style={{ ...btn, backgroundColor: "#065439" }}>
                {isPro ? "3D Pro Active (ID: 363)" : "Subscribe Monthly 3D (0.0001 Pi)"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              <div><label>Width (cm)</label><input type="number" value={w} onChange={(e) => setW(e.target.value)} style={inp} /></div>
              <div><label>Height (cm)</label><input type="number" value={h} onChange={(e) => setH(e.target.value)} style={inp} /></div>
              <div><label>Depth (cm)</label><input type="number" value={d} onChange={(e) => setD(e.target.value)} style={inp} /></div>
              <div><label>Wood</label><input type="text" value={wood} onChange={(e) => setWood(e.target.value)} style={inp} /></div>
              <div><label>Color</label><input type="text" value={color} onChange={(e) => setColor(e.target.value)} style={inp} /></div>
            </div>
            <div style={{ backgroundColor: "#2d241e", color: "#fff", padding: "24px", borderRadius: "10px", textAlign: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 8px" }}>3D Preview: {wood} | {color}</h3>
              <p style={{ margin: 0, color: "#8ee0be" }}>Size: {w}cm x {h}cm x {d}cm</p>
            </div>
            <button onClick={sendToContract} style={{ ...btn, backgroundColor: "#065439", width: "100%" }}>
              Send 3D Design to Manufacturing Contract
            </button>
          </div>
        )}

        {tab === "contract" && (
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
            <h2 style={{ color: "#5c3d2e", marginTop: 0 }}>Custom Manufacturing & Smart Contract</h2>
            <form onSubmit={createOrder} style={{ display: "grid", gap: "12px" }}>
              <input type="text" required placeholder="Project / Furniture Name" value={title} onChange={(e) => setTitle(e.target.value)} style={inp} />
              <input type="text" required placeholder="Dimensions (e.g., 240x210x60 cm)" value={dims} onChange={(e) => setDims(e.target.value)} style={inp} />
              <input type="text" placeholder="Wood Type" value={wood} onChange={(e) => setWood(e.target.value)} style={inp} />
              <input type="text" placeholder="Color & Finishing" value={color} onChange={(e) => setColor(e.target.value)} style={inp} />
              <select value={payMode} onChange={(e) => setPayMode(e.target.value)} style={inp}>
                <option value="50% Split Payment">50% Split Payment (Down & Ready to Ship)</option>
                <option value="100% Full Pi Payment">100% Full Pi Payment</option>
              </select>
              <button type="submit" style={btn}>Issue Contract & Start Tracking</button>
            </form>
          </div>
        )}

        {tab === "tracking" && (
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ color: "#5c3d2e", margin: 0 }}>Production, Packaging & Shipping Tracker</h2>
            {orders.map((o) => (
              <div key={o.id} style={{ backgroundColor: "#fff", padding: "18px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                  <strong>#{o.id} - {o.title} ({o.trackingNumber})</strong>
<span style={{ color: "#065439", fontWeight: "bold", fontSize: "13px" }}>{o.paymentPlan}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#5c3d2e", margin: "0 0 12px" }}>
                  Wood: {o.woodType} | Size: {o.dimensions} | Finish: {o.finishing}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "6px" }}>
                  {TRACKING_STAGES.map((st, i) => (
                    <div key={st} style={{ padding: "8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", backgroundColor: i + 1 <= o.currentStage ? "#065439" : "#f4ede8", color: i + 1 <= o.currentStage ? "#fff" : "#6e5d53" }}>
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "partners" && (
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
            <h2 style={{ color: "#5c3d2e", marginTop: 0 }}>Workshops & Showrooms Portal</h2>
            {pDone ? (
              <p style={{ color: "#065439", fontWeight: "bold" }}>Application submitted! We will review your workshop details soon.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setPDone(true); }} style={{ display: "grid", gap: "12px" }}>
                <input type="text" required placeholder="Workshop or Showroom Name" value={pName} onChange={(e) => setPName(e.target.value)} style={inp} />
                <select value={pType} onChange={(e) => setPType(e.target.value)} style={inp}>
                  <option value="Manufacturing Workshop">Manufacturing Workshop</option>
                  <option value="Furniture Showroom">Furniture Showroom</option>
                  <option value="Logistics & Packaging">Logistics & Packaging</option>
                </select>
                <input type="text" required placeholder="Specialty (e.g., Bedrooms, Beech Wood)" value={pSpec} onChange={(e) => setPSpec(e.target.value)} style={inp} />
                <button type="submit" style={{ ...btn, backgroundColor: "#065439" }}>Register Partner</button>
              </form>
            )}
          </div>
        )}
      </main>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#5c3d2e", display: "flex", justifyContent: "space-around", padding: "10px 4px", borderTop: "2px solid #065439" }}>
        {[
          { id: "store", label: "Store" },
          { id: "studio", label: "3D Studio" },
          { id: "contract", label: "Contract" },
          { id: "tracking", label: "Tracking" },
          { id: "partners", label: "Workshops" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ backgroundColor: tab === t.id ? "#065439" : "transparent", color: "#fff", border: "none", padding: "8px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}