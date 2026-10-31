import React from "react";
import Script from "next/script";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Pi SDK */}
        <Script src="https://minepi.com" strategy="afterInteractive" />
      </body>
    </html>
  );
}