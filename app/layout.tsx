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
        {/* تحميل حزمة البرمجة الرسمية لشبكة باي بالرابط الكامل والجاهز للتفعيل */}
        <Script 
          src=https://sdk.minepi.com/pi-sdk.js
          strategy="beforeInteractive" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}