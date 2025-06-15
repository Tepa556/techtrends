import type { Metadata } from 'next';
import TermsOfServiceContent from './TermsOfServiceContent';

// SEO метаданные для страницы условий использования
export const metadata: Metadata = {
  title: 'Условия использования - TechTrends',
  description: 'Ознакомьтесь с условиями использования платформы TechTrends: правила пользования сайтом, права и обязанности пользователей, ограничения и политика контента.',
  keywords: [
    'условия использования',
    'пользовательское соглашение',
    'правила сайта',
    'условия сервиса',
    'права пользователей',
    'обязанности пользователей',
    'правила публикации',
    'интеллектуальная собственность',
    'techtrends'
  ],
  openGraph: {
    title: 'Условия использования - TechTrends',
    description: 'Правила и условия использования платформы TechTrends для всех пользователей',
    type: 'website',
    locale: 'ru_RU',
  },
  alternates: {
    canonical: '/terms-of-service'
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function TermsOfServicePage() {
  // JSON-LD структурированные данные для страницы условий
  const termsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Условия использования TechTrends',
    description: 'Условия использования и пользовательское соглашение платформы TechTrends',
    url: `${process.env.NODE_ENV === 'production' ? 'https://techtrends.app' : 'http://localhost:3000'}/terms-of-service`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'TechTrends',
      url: process.env.NODE_ENV === 'production' ? 'https://techtrends.app' : 'http://localhost:3000',
    },
    dateModified: new Date().toISOString(),
    inLanguage: 'ru-RU',
  };

  return (
    <>
      {/* JSON-LD структурированные данные */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(termsJsonLd),
        }}
      />
      
      <TermsOfServiceContent />
    </>
  );
} 