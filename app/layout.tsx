import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | TechTrends',
    default: 'TechTrends - Технологические тренды и инновации',
  },
  description: "Актуальные технологические тренды, новости и аналитика о разработке, ИИ и технологиях",
  keywords: ["технологии", "программирование", "разработка", "инновации", "искусственный интеллект", "веб-разработка"],
  authors: [{ name: "TechTrends Team" }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://techtrends.ru',
    siteName: 'TechTrends',
    title: 'TechTrends - Технологические тренды и инновации',
    description: 'Актуальные технологические тренды, новости и аналитика',
    images: [
      {
        url: '/logo/logo-og.png',
        width: 1200,
        height: 630,
        alt: 'TechTrends',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechTrends - Технологические тренды',
    description: 'Актуальные технологические тренды, новости и аналитика',
    images: ['/logo/logo-twitter.png'],
  },
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
      </body>
    </html>
  );
}
