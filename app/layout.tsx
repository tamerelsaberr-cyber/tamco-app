import React from "react";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "TAMCO Furniture & 3D Studio",
  description: "Smart Manufacturing, 3D Design & Pi Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
        />
        <Script id="pi-sdk-init" strategy="afterInteractive">
          {`
            window.addEventListener('load', function() {
              if (window.Pi) {
                window.Pi.init({ version: "2.0", sandbox: true });
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}