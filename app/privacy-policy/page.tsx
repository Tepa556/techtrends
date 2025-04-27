"use client"
import { Container, Box, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import { useThemeStore } from '@/app/lib/ThemeStore';

export default function PrivacyPolicy() {
  const { theme } = useThemeStore();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Head>
        <title>Политика конфиденциальности | TechTrends</title>
        <meta name="description" content="Ознакомьтесь с политикой конфиденциальности портала TechTrends: как мы собираем, используем и защищаем ваши данные." />
        <meta property="og:title" content="Политика конфиденциальности | TechTrends" />
        <meta property="og:description" content="Ознакомьтесь с политикой конфиденциальности портала TechTrends." />
      </Head>
      <Header />
      <Container maxWidth="lg" className={`py-8 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}`}>
              Главная
            </Link>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Политика конфиденциальности</span>
          </Breadcrumbs>
        </Box>

        <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Политика конфиденциальности
        </h1>
        
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Последнее обновление: {new Date().toLocaleDateString()}
        </p>

        <h2 className={`text-xl font-semibold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          1. Введение
        </h2>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Добро пожаловать на TechTrends. Мы ценим ваше доверие и стремимся защитить вашу личную информацию. 
          Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем ваши данные.
        </p>

        <h2 className={`text-xl font-semibold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          2. Какую информацию мы собираем
        </h2>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Мы собираем следующие типы информации:
        </p>
        <ul className={`list-disc pl-8 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>Личная информация: имя пользователя, адрес электронной почты при регистрации.</li>
          <li>Информация о действиях: публикации, комментарии, лайки и другие взаимодействия с нашей платформой.</li>
          <li>Техническая информация: IP-адрес, тип устройства, тип браузера и операционную систему.</li>
        </ul>

        <h2 className={`text-xl font-semibold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          3. Как мы используем вашу информацию
        </h2>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Мы используем вашу информацию для:
        </p>
        <ul className={`list-disc pl-8 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>Предоставления наших услуг и улучшения пользовательского опыта.</li>
          <li>Персонализации контента и рекомендаций.</li>
          <li>Обеспечения безопасности платформы и предотвращения мошенничества.</li>
          <li>Связи с вами по важным обновлениям и уведомлениям.</li>
        </ul>

        <h2 className={`text-xl font-semibold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          4. Как мы защищаем вашу информацию
        </h2>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Мы применяем технические и организационные меры для защиты вашей информации, включая:
        </p>
        <ul className={`list-disc pl-8 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>Шифрование данных при передаче и хранении.</li>
          <li>Регулярное тестирование безопасности системы.</li>
          <li>Ограничение доступа к личной информации только для авторизованных сотрудников.</li>
        </ul>

        <h2 className={`text-xl font-semibold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          5. Ваши права
        </h2>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Вы имеете следующие права в отношении ваших данных:
        </p>
        <ul className={`list-disc pl-8 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>Право на доступ к вашей личной информации.</li>
          <li>Право на исправление неточной или неполной информации.</li>
          <li>Право на удаление вашей информации (право быть забытым).</li>
          <li>Право на ограничение обработки ваших данных.</li>
          <li>Право на передачу данных.</li>
        </ul>

        <h2 className={`text-xl font-semibold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          6. Изменения в политике конфиденциальности
        </h2>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Мы можем обновлять эту политику конфиденциальности время от времени. Мы уведомим вас о существенных изменениях 
          через электронную почту или через уведомление на нашем сайте. Мы рекомендуем периодически проверять эту страницу 
          для получения последней информации о наших практиках конфиденциальности.
        </p>

        <h2 className={`text-xl font-semibold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          7. Контактная информация
        </h2>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Если у вас есть вопросы или опасения относительно нашей политики конфиденциальности или обработки ваших данных, 
          пожалуйста, свяжитесь с нами по адресу: <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}>artez7.ru@gmail.com</span>
        </p>
      </Container>
      <Footer />
    </div>
  );
}
