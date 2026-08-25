"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 🔐 ضع اسم مستخدم Pi الخاص بك هنا بدقة (بدون علامة @) لكي يسمح لك النظام بالدخول بصفتك المدير
const ADMIN_PI_USERNAMES = ["tamerelsaber"]; 

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // التحقق من صلاحية الأدمن عبر شبكة باي عند فتح الصفحة
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.authenticate(["username"], (payment: any) => {})
        .then((auth: any) => {
          // إذا كان اسم مستخدم باي يطابق اسمك، يسمح لك بالدخول
          if (ADMIN_PI_USERNAMES.includes(auth.user.username)) {
            setIsAdmin(true);
          } else {
            alert("عذراً، أنت لا تملك صلاحيات مدير النظام للولوج لهذه الصفحة.");
            router.push("/"); // طرد المستخدم العادي للرئيسية
          }
          setLoading(false);
        })
        .catch((err: any) => {
          console.error("Auth error:", err);
          router.push("/");
          setLoading(false);
        });
    } else {
      // إذا فتحت الصفحة من متصفح عادي وليس متصفح باي
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900" style={{ direction: "rtl" }}>
        <div className="text-xl font-bold text-amber-500 animate-pulse">
          جاري التحقق من صلاحيات الأدمن عبر شبكة Pi...
        </div>
      </div>
    );
  }

  // إذا لم يكن المدير، لا تعرض له أي شيء
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4 text-center" style={{ direction: "rtl" }}>
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">تنبيه أمني!</h2>
          <p>يرجى فتح لوحة التحكم من داخل متصفح باي الرسمي باستخدام حساب المدير.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6" style={{ direction: "rtl" }}>
      {/* الهيدر العلوي للأدمن */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800 p-4 rounded-xl border border-slate-700 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">لوحة تحكم إدارة TAMCO</h1>
          <p className="text-sm text-slate-400 mt-1">مرحباً بك يا مدير النظام <span className="text-slate-200 font-bold">({ADMIN_PI_USERNAMES[0]})</span>، يمكنك الآن متابعة متجرك.</p>
        </div>
        <button 
          onClick={() => router.push("/")}
          className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors border border-slate-600"
        >
          العودة للمتجر الرئيسي
        </button>
      </header>

      {/* إحصائيات سريعة للمتجر */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-r-4 border-r-amber-500">
          <div className="text-slate-400 text-sm">إجمالي مبيعات المتجر</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">0 Pi</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-r-4 border-r-blue-500">
          <div className="text-slate-400 text-sm">المنتجات المعروضة بالموقع</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">12 منتج</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-r-4 border-r-emerald-500">
          <div className="text-slate-400 text-sm">طلبات الشراء المستلمة</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">0 طلب</div>
        </div>
      </div>

      {/* قسم إدارة منتجات الأثاث والديكور */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">قائمة المنتجات الحالية</h2>
          <button className="bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-500 transition-colors">
            + إضافة منتج جديد
          </button>
        </div>
        
        <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl bg-slate-850">
          لوحة البيانات جاهزة. في الخطوة القادمة سنقوم بربط هذا الجدول بقاعدة البيانات الخاصة بك لتبدأ التحكم الفعلي بالمنتجات.
        </div>
      </div>
    </div>
  );
}