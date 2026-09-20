import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Tamco Marketplace',
  description: 'Pi Network Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* 1. تحميل حزمة البرمجة الرسمية لشبكة باي بالرابط الكامل */}
        <Script 
          src="https://minepi.com" 
          strategy="beforeInteractive" 
        />

        {/* 2. تحميل أداة Eruda لكشف الأخطاء بالرابط الكامل */}
        <Script 
          src="https://jsdelivr.net" 
          strategy="beforeInteractive" 
        />
        
        {/* 3. تفعيل أداة كشف الأخطاء فور تشغيل التطبيق */}
        <Script id="eruda-init" strategy="afterInteractive">
          {`if (typeof window !== 'undefined') { eruda.init(); }`}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}