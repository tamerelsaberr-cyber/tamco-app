"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// الخاص بك هنا بدقة (بدون علامة @) لكي يسمح لك النظام بالدخول بصفتك المدير
const ADMIN_PI_USERNAMES = ["tamerelsaber"];

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    // التحقق من صلاحية الأدمن عبر شبكة باي عند فتح الصفحة
    if (typeof window !== "undefined" && (window as any).Pi) {
      // تهيئة البيئة التجريبية لضمان عدم الخروج لروابط فيرسيل
      (window as any).Pi.init({ version: "2.0", sandbox: true });

      (window as any).Pi.authenticate(["username"], (payment: any) => {})
        .then((auth: any) => {
          // إذا كان اسم مستخدم باي يطابق اسمك، يسمح لك بالدخول
          if (ADMIN_PI_USERNAMES.includes(auth.user.username)) {
            setIsAdmin(true);
          } else {
            alert("عذراً، أنت لا تملك صلاحيات مدير النظام للوجوه لهذه الصفحة");
            router.push("/");
          }
          setLoading(false);
        })
        .catch((err: any) => {
          console.error("Auth error:", err);
          // أوقفنا الطرد التلقائي هنا للسماح لك بإجراء الدفع حتى لو تعطل الاتصال المؤقت
          setIsAdmin(true); 
          setLoading(false);
        });
    } else {
      // إذا فتحت الصفحة من متصفح عادي وليس متصفح باي
      setIsAdmin(true); // السماح بالعرض للاختبار والتوثيق
      setLoading(false);
    }
  }, [router]);

  // دالة الدفع التجريبي لمنع الهروب لمنصة فيرسيل وتجاوز الخطوة 10
  const handleTestPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // منع المتصفح تماماً من فتح روابط خارجية

    if (!(window as any).Pi) {
      alert("يرجى الضغط على هذا الزر من داخل تطبيق Pi Browser على الهاتف حصراً لتشغيل المحفظة.");
      return;
    }

    setPaymentStatus("جاري فتح المحفظة التجريبية...");

    (window as any).Pi.createPayment({
      amount: 1, // القيمة التجريبية المطلوبة للتوثيق
      memo: "التوثيق التجريبي لتطبيق تامكو - الخطوة 10",
      metadata: { appId: "tamco77478" } // معرف تطبيقك
    }, {
      onReadyForServerApproval: function(paymentId: string) {
        console.log("تمت الموافقة المبدئية، معرف الدفع:", paymentId);
        setPaymentStatus("تمت الموافقة المبدئية، جاري التأكيد...");
      },
      onReadyForServerCompletion: function(paymentId: string, txid: string) {
        console.log("اكتمل الدفع بنجاح! رقم الحركة:", txid);
        setPaymentStatus("مبروك! تم الدفع بنجاح واجتزت الخطوة 10.");
        alert("ممتاز! تم الدفع التجريبي بنجاح واجتزت الخطوة 10 بنجاح.");
      },
      onCancel: function(paymentId: string) {
        setPaymentStatus("تم إلغاء الدفع من قِبلك.");
      },
      onError: function(error: any, paymentId: string) {
        console.error("حدث خطأ أثناء الدفع:", error);
        setPaymentStatus("فشل الدفع: " + error.message);
        alert("فشلت العملية: " + error.message);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-xl font-bold text-amber-500 animate-pulse">
          جاري التحقق من صلاحيات الأدمن عبر شبكة Pi...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-center">
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">تنبيه أمني!</h2>
          <p className="text-sm text-slate-400">يرجى فتح لوحة التحكم من داخل متصفح باي الرسمي باستخدام حساب المدير.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6" style={{ direction: "rtl" }}>
      
      {/* قسم حل المشكلة والتوثيق المباشر للخطوة 10 */}
      <div className="mb-8 p-6 bg-slate-800 border-2 border-dashed border-emerald-500 rounded-xl text-center">
        <h2 className="text-xl font-bold text-emerald-400 mb-2">قسم توثيق حساب تامكو (الخطوة 10)</h2>
        <p className="text-sm text-slate-300 mb-4">اضغط على الزر أدناه لتشغيل نافذة محفظة Pi الداخلية مباشرة دون الانتقال إلى Vercel.</p>
        
        <button 
          onClick={handleTestPayment}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
        >
          اضغط هنا لإجراء دفع تجريبي وتجاوز الخطوة 10
        </button>
        
        {paymentStatus && (
          <p className="mt-3 text-sm text-amber-400 font-medium animate-pulse">{paymentStatus}</p>
        )}
      </div>

      {/* الهيدر العلوي للأدمن الحالية لتطبيقك */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">TAMCO لوحة تحكم إدارة</h1>
          <p className="text-sm text-slate-400 mt-1">مرحباً بك يا مدير النظام <span className="text-amber-400 font-bold">tamerelsaber</span></p>
        </div>
        <button 
          onClick={() => router.push("/")}
          className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors mt-4 md:mt-0"
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
          <h2 className="text-xl font-bold text-slate-100">قائمة المنتجات الحالية (12)</h2>
          <button className="bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-500 transition-colors">
            إضافة منتج جديد +
          </button>
        </div>
        <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
          لوحة البيانات جاهزة، في الخطوة القادمة سنقوم بربط هذا الجدول بقاعدة البيانات الخاصة بك لتبدأ التحكم الفعلي بالمنتجات.
        </div>
      </div>

    </div>
  );
}