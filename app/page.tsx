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
import { LANG_TEXT } from "./tamcoLang";

export default function TamcoUnifiedApp() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const t = LANG_TEXT[lang];

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

    const initPi = () => {
      const piSDK = (window as any).Pi;
      if (piSDK && typeof piSDK.init === "function") {
        try {
          piSDK.init({ version: "2.0", sandbox: true });
        } catch {}
      }
    };
    initPi();
    const timer = setTimeout(initPi, 1500);
    return () => clearTimeout(timer);
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
    setMsg("Smart Contract created.");
  };

  const inp = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d5c7be" };
  const btn = { backgroundColor: "#5c3d2e", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };

  return (
    <div dir={t.dir} style={{ backgroundColor: "#fcfaf8", minHeight: "100vh", color: "#2d241e", fontFamily: "sans-serif", paddingBottom: "85px" }}>
      <header style={{ backgroundColor: "#5c3d2e", color: "#fff", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "19px" }}>{t.title}</h1>
          <span style={{ fontSize: "12px", color: "#e6d7ce" }}>{t.subtitle}</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ backgroundColor: "#e6d7ce", color: "#5c3d2e", border: "none", padding: "5px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            {t.langBtn}
          </button>
          <span style={{ backgroundColor: "#065439", padding: "5px 10px", borderRadius: "16px", fontSize: "11px", fontWeight: "bold" }}>
            {isPro ? t.proActive : t.testnetReady}
          </span>
          <Link href="/admin" style={{ backgroundColor: "#fff", color: "#5c3d2e", padding: "5px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", textDecoration: "none" }}>
            {t.adminBtn}
          </Link>
        </div>
      </header>

      {msg && <div style={{ backgroundColor: "#065439", color: "#fff", padding: "10px", textAlign: "center", fontSize: "14px" }}>{msg}</div>}

      <main style={{ padding: "20px 16px", maxWidth: "1050px", margin: "0 auto" }}>
        {tab === "store" && (
          <div>
            <h2 style={{ color: "#5c3d2e", marginTop: 0 }}>{t.storeTitle}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {products.map((p) => (
                <div key={p.id} style={{ backgroundColor: "#fff", padding: "18px", borderRadius: "12px", border: "1px solid #eadfd8" }}>
                  <div style={{ height: "110px", backgroundColor: "#f4ede8", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#5c3d2e", fontWeight: "bold", marginBottom: "10px" }}>
                    {p.category || "TAMCO"}
                  </div>
                  <h3 style={{ margin: "6px 0", fontSize: "16px" }}>{p.name}</h3>
                  <p style={{ color: "#065439", fontWeight: "bold", margin: "6px 0 12px" }}>{p.price}</p>
                  <button onClick={() => { setTitle(p.name); setDims("Standard Size"); setTab("contract"); }} style={{ ...btn, width: "100%" }}>
                    {t.orderBtn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "studio" && (
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
              <h2 style={{ color: "#5c3d2e", margin: 0 }}>{t.studioTitle}</h2>
              <button onClick={handleSubscribe} style={{ ...btn, backgroundColor: "#065439" }}>
                {isPro ? t.subActiveBtn : t.subBtn}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              <div><label>{t.width}</label><input type="number" value={w} onChange={(e) => setW(e.target.value)} style={inp} /></div>
              <div><label>{t.height}</label><input type="number" value={h} onChange={(e) => setH(e.target.value)} style={inp} /></div>
              <div><label>{t.depth}</label><input type="number" value={d} onChange={(e) => setD(e.target.value)} style={inp} /></div>
              <div><label>{t.wood}</label><input type="text" value={wood} onChange={(e) => setWood(e.target.value)} style={inp} /></div>
              <div><label>{t.color}</label><input type="text" value={color} onChange={(e) => setColor(e.target.value)} style={inp} /></div>
            </div>
            <div style={{ backgroundColor: "#2d241e", color: "#fff", padding: "24px", borderRadius: "10px", textAlign: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 8px" }}>3D: {wood} | {color}</h3>
              <p style={{ margin: 0, color: "#8ee0be" }}>{w}cm x {h}cm x {d}cm</p>
            </div>
            <button onClick={sendToContract} style={{ ...btn, backgroundColor: "#065439", width: "100%" }}>
              {t.send3dBtn}
            </button>
          </div>
        )}

        {tab === "contract" && (
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
            <h2 style={{ color: "#5c3d2e", marginTop: 0 }}>{t.contractTitle}</h2>
            <form onSubmit={createOrder} style={{ display: "grid", gap: "12px" }}>
              <input type="text" required placeholder="Project / Furniture Name" value={title} onChange={(e) => setTitle(e.target.value)} style={inp} />
              <input type="text" required placeholder="Dimensions (e.g., 240x210x60 cm)" value={dims} onChange={(e) => setDims(e.target.value)} style={inp} />
              <input type="text" placeholder={t.wood} value={wood} onChange={(e) => setWood(e.target.value)} style={inp} />
              <input type="text" placeholder={t.color} value={color} onChange={(e) => setColor(e.target.value)} style={inp} />
              <select value={payMode} onChange={(e) => setPayMode(e.target.value)} style={inp}>
                <option value="50% Split Payment">50% Split Payment</option>
                <option value="100% Full Pi Payment">100% Full Pi Payment</option>
              </select>
              <button type="submit" style={btn}>{t.issueBtn}</button>
            </form>
          </div>
        )}

        
{tab === "tracking" && (
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ color: "#5c3d2e", margin: 0 }}>{t.trackingTitle}</h2>
            {orders.map((o) => (
              <div key={o.id} style={{ backgroundColor: "#fff", padding: "18px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                  <strong>#{o.id} - {o.title} ({o.trackingNumber})</strong>
                  <span style={{ color: "#065439", fontWeight: "bold", fontSize: "13px" }}>{o.paymentPlan}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#5c3d2e", margin: "0 0 12px" }}>
                  {o.woodType} | {o.dimensions} | {o.finishing}
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
            <h2 style={{ color: "#5c3d2e", marginTop: 0 }}>{t.partnersTitle}</h2>
            {pDone ? (
              <p style={{ color: "#065439", fontWeight: "bold" }}>Partner registered successfully!</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setPDone(true); }} style={{ display: "grid", gap: "12px" }}>
                <input type="text" required placeholder="Workshop / Showroom Name" value={pName} onChange={(e) => setPName(e.target.value)} style={inp} />
                <select value={pType} onChange={(e) => setPType(e.target.value)} style={inp}>
                  <option value="Manufacturing Workshop">Manufacturing Workshop</option>
                  <option value="Furniture Showroom">Furniture Showroom</option>
                  <option value="Logistics & Packaging">Logistics & Packaging</option>
                </select>
                <input type="text" required placeholder="Specialty" value={pSpec} onChange={(e) => setPSpec(e.target.value)} style={inp} />
                <button type="submit" style={{ ...btn, backgroundColor: "#065439" }}>{t.regPartnerBtn}</button>
              </form>
            )}
          </div>
        )}
      </main>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#5c3d2e", display: "flex", justifyContent: "space-around", padding: "10px 4px", borderTop: "2px solid #065439" }}>
        {[
          { id: "store", label: t.tabStore },
          { id: "studio", label: t.tabStudio },
          { id: "contract", label: t.tabContract },
          { id: "tracking", label: t.tabTracking },
          { id: "partners", label: t.tabWorkshops },
        ].map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{ backgroundColor: tab === item.id ? "#065439" : "transparent", color: "#fff", border: "none", padding: "8px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}