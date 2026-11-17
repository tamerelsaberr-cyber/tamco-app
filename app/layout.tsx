import React from "react";
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
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}