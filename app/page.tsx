
'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.init({ version: "2.0" });
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
      <h1>Pi Connection Successful</h1>
      <p>Please press start in Pi Browser.</p>
    </div>
  );
}