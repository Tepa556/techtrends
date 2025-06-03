import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import YandexMetrica from "./components/YandexMetrica";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production' 
      ? 'https://techtrends-cyan.vercel.app' 
      : 'http://localhost:3000'
  ),
  title: {
    template: '%s | TechTrends',
    default: 'TechTrends - Технологические тренды и инновации',
  },
  description: "Актуальные технологические тренды, новости и аналитика о разработке, ИИ и технологиях",
  keywords: ["технологии", "программирование", "разработка", "инновации", "искусственный интеллект", "веб-разработка"],
  robots: {
    index: true,
    follow: true,
  }
};

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
        
        {/* Аналитика - только в продакшене */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {process.env.NEXT_PUBLIC_GA_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
            {process.env.NEXT_PUBLIC_YM_ID && (
              <YandexMetrica ymId={process.env.NEXT_PUBLIC_YM_ID} />
            )}
          </>
        )}
      </body>
    </html>
  );
}
