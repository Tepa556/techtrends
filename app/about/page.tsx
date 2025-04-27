"use client"
import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import { useThemeStore } from '@/app/lib/ThemeStore';

export default function AboutPage() {
  const { theme } = useThemeStore();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Head>
        <title>О проекте | TechTrends</title>
        <meta name="description" content="Узнайте о миссии и команде TechTrends - портала о технологических трендах и инновациях." />
        <meta property="og:title" content="О проекте TechTrends" />
        <meta property="og:description" content="Узнайте о миссии и команде TechTrends - портала о технологических трендах и инновациях." />
      </Head>
      <Header />
      <div className={`container mx-auto px-4 py-12 mt-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>О проекте TechTrends</h1>
              
          <div className={`prose prose-lg max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Наша миссия</h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              TechTrends был создан с целью помочь людям ориентироваться в быстро меняющемся мире 
              технологий. Наша миссия — предоставлять точную, своевременную и доступную информацию 
              о последних технологических трендах, инновациях и их влиянии на общество.
            </p>
            
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Кто мы</h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Мы команда технологических энтузиастов, программистов, аналитиков и журналистов, 
              объединенных общей страстью к инновациям. Каждый член нашей команды специализируется 
              в определенной области технологий, что позволяет нам охватывать широкий спектр тем: 
              от искусственного интеллекта и больших данных до веб-разработки и кибербезопасности.
            </p>
            
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Наши ценности</h2>
            <ul className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              <li><strong>Достоверность</strong>: Мы тщательно проверяем все факты перед публикацией.</li>
              <li><strong>Доступность</strong>: Мы стремимся объяснять сложные технические концепции простым языком.</li>
              <li><strong>Объективность</strong>: Мы представляем разные точки зрения и избегаем предвзятости.</li>
              <li><strong>Инновационность</strong>: Мы постоянно ищем новые форматы и подходы к подаче информации.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 