import './globals.css';

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
        {/* رابط مكتبة باي البرمجية الرسمية والكاملة بشكل سليم ومضمون */}
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}