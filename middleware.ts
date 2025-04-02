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

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    console.log("Обрабатывается путь:", path);
    
    // 1. Обработка путей администратора
    if (path.startsWith('/admin')) {
        console.log("Обнаружен путь админа:", path);
        
        // Для страницы входа админа просто пропускаем проверку
        if (path === ADMIN_LOGIN_PATH) {
            console.log("Пропускаем страницу логина админа");
            return NextResponse.next();
        }
        
        // Проверяем, входит ли путь в список админских путей, требующих проверки
        const requiresAdminCheck = ADMIN_PATHS.some(adminPath => path.startsWith(adminPath));
        if (requiresAdminCheck) {
            console.log("Путь требует проверки прав администратора");
            
            // Проверяем только наличие токена админа без проверки JWT
            const adminToken = request.cookies.get('admin_token')?.value;
            console.log("Токен админа:", adminToken ? "Присутствует" : "Отсутствует");
            
            if (!adminToken) {
                console.log("Перенаправление на страницу логина админа (токен отсутствует)");
                return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
            }
            
            // Токен есть - пропускаем пользователя без дополнительных проверок
            console.log("Токен админа найден, пропускаем запрос");
        }
    } 
    // 2. Проверяем, является ли путь публичным
    else if (!isPublicPath(path)) {
        console.log("Путь требует аутентификации пользователя:", path);
        
        // Если путь не публичный и не админский, то проверяем наличие токена пользователя
        const userToken = request.cookies.get('token')?.value;
        console.log("Токен пользователя:", userToken ? "Присутствует" : "Отсутствует");
        
        if (!userToken) {
            console.log("Перенаправление на главную (токен отсутствует)");
            return NextResponse.redirect(new URL(HOME_PATH, request.url));
        }
        
        // Проверяем валидность токена
        try {
            const jwtSecret = process.env.JWT_SECRET || '';
            jwt.verify(userToken, jwtSecret);
            console.log("Токен пользователя валиден");
        } catch (error) {
            console.log("Перенаправление на главную (недействительный токен)");
            return NextResponse.redirect(new URL(HOME_PATH, request.url));
        }
    } else {
        console.log("Публичный путь, пропускаем без проверки");
    }
    
    console.log("Пропускаем запрос дальше");
    return NextResponse.next();
}

// Функция для проверки, является ли путь публичным
function isPublicPath(path: string): boolean {
    // Проверяем точное совпадение или если путь начинается с публичного пути + "/"
    return PUBLIC_PATHS.some(publicPath => 
        path === publicPath || 
        (path.startsWith(publicPath + '/') && publicPath !== '/')
    );
}

// Обрабатываем все пути, кроме статических файлов и API
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};