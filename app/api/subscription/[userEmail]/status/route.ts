import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;

export async function GET(
    req: NextRequest,
    { params }: { params: { userEmail: string } }
) {
    try {
        // Извлекаем токен из заголовка Authorization
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Токен авторизации не предоставлен' }, { status: 401 });
        }
        
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
        
        // Подключение к MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');

        // Получаем userEmail из параметров (с await)
        const userEmail = await params.userEmail;

        // Находим пользователя по email
        const user = await usersCollection.findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json({ isSubscribed: false }, { status: 200 });
        }

        // Находим текущего пользователя
        const currentUser = await usersCollection.findOne({ email: decoded.email });

        if (!currentUser) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        // Проверяем, подписан ли текущий пользователь на указанного пользователя
        const isSubscribed = currentUser.subscriptions && currentUser.subscriptions.includes(userEmail);

        await client.close();

        return NextResponse.json({ isSubscribed }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при проверке статуса подписки:', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
} 