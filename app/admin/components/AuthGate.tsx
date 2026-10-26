"use client";
import { useState, useEffect } from "react";
import { ADMIN_CONFIG } from "../config";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState("");

  useEffect(() => {
    if (localStorage.getItem("tamco_admin") === "ok") setOk(true);
  }, []);

  const login = () => {
    if (pass === ADMIN_CONFIG.password) {
      localStorage.setItem("tamco_admin", "ok");
      setOk(true);
    } else {
      alert("باسورد غلط يا تامر!");
    }
  };

  if (ok) return <>{children}</>;

  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      <h2>TAMCO Admin Login</h2>
      <input 
        type="password" 
        value={pass} 
        onChange={(e) => setPass(e.target.value)}
        placeholder="دخل الباسورد"
        style={{ padding: 10, margin: 10 }}
      />
      <br/>
      <button onClick={login} style={{ padding: "10px 20px" }}>دخول</button>
    </div>
  );
}