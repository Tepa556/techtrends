import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;

export async function GET(request: NextRequest, { params }: { params: { userEmail: string } }) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let currentUserEmail;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        currentUserEmail = decoded.email; // Получаем email текущего пользователя
    } catch (error) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('local'); // Укажите имя вашей базы данных
        const usersCollection = database.collection('users');

        // Находим пользователя по email
        const user = await usersCollection.findOne({ email: params.userEmail });

        if (!user) {
            return NextResponse.json({ isSubscribed: false }, { status: 200 });
        }

        // Проверяем, подписан ли текущий пользователь
        const isSubscribed = user.subscribers.includes(currentUserEmail);
        return NextResponse.json({ isSubscribed });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Ошибка при проверке подписки' }, { status: 500 });
    } finally {
        await client.close();
    }
} 