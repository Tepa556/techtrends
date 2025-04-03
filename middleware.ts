import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Константы для путей
const ADMIN_LOGIN_PATH = '/admin/login';
const HOME_PATH = '/';

// Более конкретные пути администратора, требующие проверки
const ADMIN_PATHS = ['/admin', '/admin/posts', '/admin/users', '/admin/settings'];

// Пути, которые доступны без аутентификации (публичные пути)
const PUBLIC_PATHS = [
    '/',                // Главная страница
    '/login',           // Страница входа
    '/register',        // Страница регистрации
    '/about',           // О нас
    '/contact',         // Контакты
    '/blog',            // Публичный блог
    '/post',            // Просмотр публичного поста
    '/search',          // Поиск
    '/categories',      // Категории
    '/verify-email',    // Подтверждение email
    '/reset-password',  // Сброс пароля
    '/privacy-policy',  // Политика конфиденциальности
    '/terms',           // Условия использования
    '/faq',             // FAQ
    '/api',             // API эндпоинты
];

// Функция для проверки, является ли путь публичным
const isPublicPath = (path: string) => {
    return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath)) || path.startsWith('/post-back');
};

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // Пропускаем запросы к статическим файлам
    if (path.startsWith('/post-back')|| path.startsWith('/user-avatar') || path.startsWith('/api')) {
        return NextResponse.next();
    }
    
    // 1. Обработка путей администратора
    if (path.startsWith('/admin')) {
        // Для страницы входа админа просто пропускаем проверку
        if (path === ADMIN_LOGIN_PATH) {
            return NextResponse.next();
        }
        
        // Проверяем, входит ли путь в список админских путей, требующих проверки
        const requiresAdminCheck = ADMIN_PATHS.some(adminPath => path.startsWith(adminPath));
        if (requiresAdminCheck) {
            // Проверяем только наличие токена админа без проверки JWT
            const adminToken = request.cookies.get('admin_token')?.value;
            
            if (!adminToken) {
                return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
            }
            
            // Токен есть - пропускаем пользователя без дополнительных проверок
        }
    } 
    // 2. Проверяем, является ли путь публичным
    else if (!isPublicPath(path)) {
        // Если путь не публичный и не админский, то проверяем наличие токена пользователя
        const userToken = request.cookies.get('token')?.value;
        
        if (!userToken) {
            return NextResponse.redirect(new URL(HOME_PATH, request.url));
        }
        
        // Проверяем валидность токена

    }
    
    return NextResponse.next();
}

// Обрабатываем все пути, кроме статических файлов и API
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};