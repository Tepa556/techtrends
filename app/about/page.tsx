import type { Metadata } from 'next';
import React from 'react';
import AboutContent from './AboutContent';

// SEO метаданные для страницы "О нас"
export const metadata: Metadata = {
  title: 'О проекте TechTrends - Наша миссия и команда',
  description: 'Узнайте больше о команде TechTrends, нашей миссии по освещению технологических трендов и инноваций. Мы объединяем экспертов в области ИИ, веб-разработки и кибербезопасности.',
  keywords: [
    'о нас',
    'наша миссия',
    'технологические тренды',
    'инновации',
    'искусственный интеллект',
    'веб-разработка',
    'кибербезопасность'
  ],
  openGraph: {
    title: 'О проекте TechTrends - Наша миссия и команда',
    description: 'Команда технологических энтузиастов, программистов и аналитиков, объединенных страстью к инновациям',
    type: 'website',
    locale: 'ru_RU',
  },
  alternates: {
    canonical: '/about'
  },
  robots: {
    index: true,
    follow: true,
  }
};

// JSON-LD структурированные данные для организации
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TechTrends',
  description: 'Платформа для освещения технологических трендов и инноваций',
  url: process.env.NODE_ENV === 'production' ? 'https://techtrends.app' : 'http://localhost:3000',
  logo: process.env.NODE_ENV === 'production' ? 'https://techtrends.app/logo.png' : 'http://localhost:3000/logo.png',
  foundingDate: '2024',
  sameAs: [
    // Добавьте ссылки на социальные сети, если есть
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Russian'
  }
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD структурированные данные */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      
      <AboutContent />
    </>
  );
} 