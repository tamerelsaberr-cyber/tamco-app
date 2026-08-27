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

        <Script 
          src="https://minepi.com" 
          strategy="beforeInteractive" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}