import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./global.css";
// استدعاء ملف الحماية الأصلي مع تصحيح المسار بدقة 100%
import { PiAuthProvider } from "../contexts/pi-auth-context";

export const metadata: Metadata = {
  title: "Tamco Marketplace",
  description: "Pi Network Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* تفعيل حماية شبكة باي الأصلية المتواجدة بمشروعك */}
        <PiAuthProvider>
          {children}
        </PiAuthProvider>
      </body>
    </html>
  );
}