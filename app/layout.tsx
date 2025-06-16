import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import YandexMetrica from "./components/YandexMetrica";
import ChunkLoadErrorHandler from "./components/ChunkLoadErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Обработчик ошибок загрузки чанков */}
        <ChunkLoadErrorHandler />
        
        {/* Аналитика - только в продакшене */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Suspense fallback={null}>
              <GoogleAnalytics gaId="G-1G2QHCMQ3L" />
            </Suspense>
            <Suspense fallback={null}>
              <YandexMetrica ymId="102646909" />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
