'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // تهيئة كود Pi SDK فور فتح الصفحة
    if (typeof window !== 'undefined' && (window as any).Pi) {
      (window as any).Pi.init({ version: "2.0" });
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif' 
    }}>
      <h1>Pi Developer Portal Connection Successful!</h1>
      <p>Please press the Start button in Pi Browser to process the transaction.</p>
    </div>
  );