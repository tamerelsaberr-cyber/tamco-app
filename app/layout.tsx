
import Script from 'next/script';

export const metadata = {
  title: "Tamco Marketplace",
  description: "Pi Network Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="beforeInteractive" 
        />
        {children}
      </body>
    </html>
  );
}