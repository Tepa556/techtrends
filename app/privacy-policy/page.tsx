"use client"

import { Container, Typography, Box, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
export default function PrivacyPolicy() {
  return (
    <>
    <Header />
    <Container maxWidth="lg" className="py-8">
      <Box mb={4}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Главная
          </Link>
          <Typography color="text.primary">Политика конфиденциальности</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom className="font-bold">
        Политика конфиденциальности
      </Typography>
      
      <Typography variant="body1" paragraph>
        Последнее обновление: {new Date().toLocaleDateString()}
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom className="font-semibold mt-6">
        1. Введение
      </Typography>
      <Typography variant="body1" paragraph>
        Добро пожаловать на TechTrends. Мы ценим ваше доверие и стремимся защитить вашу личную информацию. 
        Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем ваши данные.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom className="font-semibold mt-6">
        2. Какую информацию мы собираем
      </Typography>
      <Typography variant="body1" paragraph>
        Мы собираем следующие типы информации:
      </Typography>
      <ul className="list-disc pl-8 mb-4">
        <li>Личная информация: имя пользователя, адрес электронной почты при регистрации.</li>
        <li>Информация о действиях: публикации, комментарии, лайки и другие взаимодействия с нашей платформой.</li>
        <li>Техническая информация: IP-адрес, тип устройства, тип браузера и операционную систему.</li>
      </ul>

      <Typography variant="h6" component="h2" gutterBottom className="font-semibold mt-6">
        3. Как мы используем вашу информацию
      </Typography>
      <Typography variant="body1" paragraph>
        Мы используем вашу информацию для:
      </Typography>
      <ul className="list-disc pl-8 mb-4">
        <li>Предоставления наших услуг и улучшения пользовательского опыта.</li>
        <li>Персонализации контента и рекомендаций.</li>
        <li>Обеспечения безопасности платформы и предотвращения мошенничества.</li>
        <li>Связи с вами по важным обновлениям и уведомлениям.</li>
      </ul>

      <Typography variant="h6" component="h2" gutterBottom className="font-semibold mt-6">
        4. Как мы защищаем вашу информацию
      </Typography>
      <Typography variant="body1" paragraph>
        Мы применяем технические и организационные меры для защиты вашей информации, включая:
      </Typography>
      <ul className="list-disc pl-8 mb-4">
        <li>Шифрование данных при передаче и хранении.</li>
        <li>Регулярное тестирование безопасности системы.</li>
        <li>Ограничение доступа к личной информации только для авторизованных сотрудников.</li>
      </ul>

      <Typography variant="h6" component="h2" gutterBottom className="font-semibold mt-6">
        5. Ваши права
      </Typography>
      <Typography variant="body1" paragraph>
        Вы имеете следующие права в отношении ваших данных:
      </Typography>
      <ul className="list-disc pl-8 mb-4">
        <li>Право на доступ к вашей личной информации.</li>
        <li>Право на исправление неточной или неполной информации.</li>
        <li>Право на удаление вашей информации (право быть забытым).</li>
        <li>Право на ограничение обработки ваших данных.</li>
        <li>Право на передачу данных.</li>
      </ul>

      <Typography variant="h6" component="h2" gutterBottom className="font-semibold mt-6">
        6. Изменения в политике конфиденциальности
      </Typography>
      <Typography variant="body1" paragraph>
        Мы можем обновлять эту политику конфиденциальности время от времени. Мы уведомим вас о существенных изменениях 
        через электронную почту или через уведомление на нашем сайте. Мы рекомендуем периодически проверять эту страницу 
        для получения последней информации о наших практиках конфиденциальности.
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom className="font-semibold mt-6">
        7. Контактная информация
      </Typography>
      <Typography variant="body1" paragraph>
        Если у вас есть вопросы или опасения относительно нашей политики конфиденциальности или обработки ваших данных, 
        пожалуйста, свяжитесь с нами по адресу: <span className="text-blue-500">artez7.ru@gmail.com</span>
      </Typography>
    </Container>
    <Footer />
    </>
  );
}

