'use client';
import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
  onLogin?: (user: any) => void;
};

export default function AuthGate({ children, onLogin }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);

  const handleLogin = () => {
    if (!pass) return alert('اكتب الباسورد');
    setAuthed(true);
    onLogin?.({ user: 'admin' });
  };

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4" dir="rtl">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black">T</div>
        <h2 className="text-2xl font-bold text-white mb-2">تامكو</h2>
        <p className="text-white/60 mb-6 text-sm">لوحة تحكم الادمن</p>
        
        <div className="relative mb-4">
          <input 
            type={show ? "text" : "password"}
            value={pass} 
            onChange={e=>setPass(e.target.value)}
            placeholder="كلمة سر الادمن"
            className="w-full border border-white/20 bg-white/10 text-white p-3 pl-12 rounded-xl outline-none focus:border-yellow-400 placeholder:text-white/40"
            onKeyDown={e=> e.key==='Enter' && handleLogin()}
          />
          <button 
            type="button"
            onClick={()=>setShow(!show)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xl"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <button onClick={handleLogin} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold w-full py-3 rounded-xl hover:scale-[1.02] transition">
          دخول
        </button>
        <p className="text-white/30 text-xs mt-4">المحفظة: GBBVIQ...WJ47</p>
      </div>
    </div>
  );
}