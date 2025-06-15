"use client"
import React from 'react';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import { useThemeStore } from '@/app/lib/ThemeStore';

export default function AboutContent() {
  const { theme } = useThemeStore();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Header />
      <div className={`container mx-auto px-4 py-12 mt-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Главный заголовок H1 для SEO */}
          <header>
            <h1 className={`text-4xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              О проекте TechTrends
            </h1>
          </header>
              
          <main className={`prose prose-lg max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
            {/* Секция "Наша миссия" */}
            <section>
              <h2 className={`text-3xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Наша миссия
              </h2>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                TechTrends был создан с целью помочь людям ориентироваться в быстро меняющемся мире 
                технологий. Наша миссия — предоставлять точную, своевременную и доступную информацию 
                о последних технологических трендах, инновациях и их влиянии на общество.
              </p>
            </section>
            
            {/* Секция "Кто мы" */}
            <section>
              <h2 className={`text-3xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Кто мы
              </h2>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Мы команда технологических энтузиастов, программистов, аналитиков и журналистов, 
                объединенных общей страстью к инновациям. Каждый член нашей команды специализируется 
                в определенной области технологий, что позволяет нам охватывать широкий спектр тем: 
                от <strong>искусственного интеллекта</strong> и <strong>больших данных</strong> до <strong>веб-разработки</strong> и <strong>кибербезопасности</strong>.
              </p>
            </section>
            
            {/* Секция "Наши ценности" */}
            <section>
              <h2 className={`text-3xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Наши ценности
              </h2>
              <ul className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                <li>
                  <strong>Достоверность</strong>: Мы тщательно проверяем все факты перед публикацией.
                </li>
                <li>
                  <strong>Доступность</strong>: Мы стремимся объяснять сложные технические концепции простым языком.
                </li>
                <li>
                  <strong>Объективность</strong>: Мы представляем разные точки зрения и избегаем предвзятости.
                </li>
                <li>
                  <strong>Инновационность</strong>: Мы постоянно ищем новые форматы и подходы к подаче информации.
                </li>
              </ul>
            </section>

            {/* Дополнительная секция для SEO */}
            <section>
              <h2 className={`text-3xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Что мы освещаем
              </h2>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                На TechTrends вы найдете актуальную информацию о:
              </p>
              <ul className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                <li>Последних достижениях в области искусственного интеллекта и машинного обучения</li>
                <li>Новых фреймворках и технологиях веб-разработки</li>
                <li>Трендах в мобильной разработке и кроссплатформенных решениях</li>
                <li>Инновациях в области кибербезопасности и защиты данных</li>
                <li>Развитии облачных технологий и DevOps практик</li>
                <li>Блокчейн технологиях и криптовалютах</li>
              </ul>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
} 