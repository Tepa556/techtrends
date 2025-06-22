# TechTrends

🚀 **Современная платформа для технологических новостей и трендов**

TechTrends - это полнофункциональная веб-платформа для публикации и обсуждения технологических новостей, построенная на Next.js 15 с использованием TypeScript, MongoDB и современного UI.

## 📋 Содержание

- [Особенности](#особенности)
- [Технологии](#технологии)
- [Быстрый старт](#быстрый-старт)
- [Структура проекта](#структура-проекта)
- [API Endpoints](#api-endpoints)
- [Развертывание](#развертывание)
- [Конфигурация](#конфигурация)
- [Участие в разработке](#участие-в-разработке)

## ✨ Особенности

### 👤 Управление пользователями
- Регистрация и аутентификация пользователей
- JWT-авторизация
- Профили пользователей с возможностью редактирования
- Система подписок между пользователями
- Уведомления

### 📝 Система публикаций
- Создание, редактирование и удаление постов
- Категоризация контента
- Система рейтингов и лайков
- Комментарии с вложенностью
- Модерация контента

### 🛡️ Админ-панель
- Управление пользователями
- Модерация постов (одобрение/отклонение)
- Аналитика и статистика
- Управление категориями

### 🎨 UI/UX
- Адаптивный дизайн с Tailwind CSS
- Темная/светлая тема
- Material-UI компоненты
- Модальные окна и интерактивные элементы
- Оптимизация производительности

### 📊 Аналитика
- Интеграция с Google Analytics
- Yandex Metrica
- SEO оптимизация
- Карта сайта и robots.txt

## 🛠 Технологии

### Frontend
- **Next.js 15** - React фреймворк с SSR/SSG
- **TypeScript** - Статическая типизация
- **Tailwind CSS** - Utility-first CSS фреймворк
- **Material-UI** - React компоненты
- **Zustand** - Управление состоянием
- **Socket.IO** - Реалтайм коммуникация

### Backend
- **Next.js API Routes** - Серверная логика
- **MongoDB** - NoSQL база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - JSON Web Tokens для аутентификации
- **bcryptjs** - Хеширование паролей
- **Formidable** - Обработка файлов

### Инструменты разработки
- **ESLint** - Линтер кода
- **PostCSS** - CSS обработка
- **TypeScript** - Статическая типизация

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ и npm/yarn/pnpm
- MongoDB (локальная установка или MongoDB Atlas)

### Установка

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd techtrends
```

2. **Установите зависимости**
```bash
npm install
# или
yarn install
# или
pnpm install
```

3. **Настройте переменные окружения**
```bash
# Создайте файл .env.local в корне проекта
cp .env.example .env.local
```

Заполните следующие переменные:
```env
# База данных
MONGODB_URI=mongodb://localhost:27017/techtrends
# или для MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techtrends

# JWT секрет
JWT_SECRET=your-super-secret-jwt-key

# Настройки приложения
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Аналитика (опционально)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_YM_ID=your-yandex-metrica-id
```

4. **Запустите сервер разработки**
```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```

5. **Откройте приложение**
Перейдите по адресу [http://localhost:3000](http://localhost:3000)

## 📁 Структура проекта

```
techtrends/
├── app/                          # Next.js 13+ App Router
│   ├── api/                      # API маршруты
│   │   ├── auth/                 # Аутентификация
│   │   ├── post/                 # Управление постами
│   │   ├── user/                 # Управление пользователями
│   │   ├── admin/                # Админ API
│   │   └── subscription/         # Подписки
│   ├── components/               # Переиспользуемые компоненты
│   ├── layouts/                  # Компоненты макетов
│   ├── ui/                       # UI компоненты
│   ├── lib/                      # Утилиты и конфигурация
│   ├── types/                    # TypeScript типы
│   ├── (pages)/                  # Страницы приложения
│   │   ├── about/                # О проекте
│   │   ├── admin/                # Админ-панель
│   │   ├── category/             # Категории постов
│   │   ├── post/                 # Детали поста
│   │   ├── profile/              # Профиль пользователя
│   │   └── profiles/             # Список профилей
│   ├── globals.css               # Глобальные стили
│   └── layout.tsx                # Корневой макет
├── public/                       # Статические файлы
│   ├── logo/                     # Логотипы
│   ├── post-back/                # Изображения постов
│   └── user-avatar/              # Аватары пользователей
├── middleware.ts                 # Next.js middleware
└── next.config.ts                # Конфигурация Next.js
```

## 🔗 API Endpoints

### Аутентификация
- `POST /api/auth` - Вход в систему
- `POST /api/reg` - Регистрация

### Посты
- `GET /api/posts` - Получить все посты
- `POST /api/post/create` - Создать пост
- `PUT /api/post/update` - Обновить пост
- `DELETE /api/post/delete/[postId]` - Удалить пост
- `GET /api/post/[postId]` - Получить пост по ID
- `POST /api/post/like/[postId]` - Лайкнуть пост

### Пользователи
- `GET /api/user` - Получить данные пользователя
- `PUT /api/user/update` - Обновить профиль
- `DELETE /api/user/delete` - Удалить аккаунт

### Комментарии
- `GET /api/post/comment/[postId]` - Получить комментарии
- `POST /api/post/comment/[postId]` - Добавить комментарий
- `DELETE /api/post/comment/[postId]/[commentId]` - Удалить комментарий

### Админ
- `GET /api/admin/posts` - Управление постами
- `POST /api/admin/posts/[postId]/status` - Изменить статус поста

## 🚀 Развертывание

### Сборка для продакшена
```bash
npm run build
npm run start
```

### Рекомендуемые платформы
- **Vercel** (рекомендуется для Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Docker (опционально)
```dockerfile
# Dockerfile пример
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## ⚙️ Конфигурация

### Переменные окружения
```env
# Обязательные
MONGODB_URI=              # URI подключения к MongoDB
JWT_SECRET=               # Секретный ключ для JWT

# Опциональные
NEXT_PUBLIC_BASE_URL=     # Базовый URL приложения
NEXT_PUBLIC_GA_ID=        # Google Analytics ID
NEXT_PUBLIC_YM_ID=        # Yandex Metrica ID
```

### Настройка MongoDB
1. Создайте базу данных `techtrends`
2. Настройте коллекции: `users`, `posts`, `comments`
3. Создайте индексы для оптимизации поиска

## 📱 Telegram канал

Подпишитесь на наш Telegram канал для получения последних новостей и обновлений:
**[t.me/techtrendsapp](https://t.me/techtrendsapp)**

## 🤝 Участие в разработке

1. Создайте форк репозитория
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Стандарты кода
- Используйте TypeScript для всех новых файлов
- Следуйте конфигурации ESLint
- Добавляйте комментарии для сложной логики
- Покрывайте новый функционал тестами

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 🔗 Полезные ссылки

- [Документация Next.js](https://nextjs.org/docs)
- [MongoDB документация](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Material-UI](https://mui.com/)

---


