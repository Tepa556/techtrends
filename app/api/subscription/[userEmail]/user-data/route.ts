import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let currentUserEmail;

    try {
        const decoded = jwt.verify(token, jwtSecret) as { email: string };
        currentUserEmail = decoded.email; // Получаем email текущего пользователя
    } catch (error) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('local'); // Укажите имя вашей базы данных
        const usersCollection = database.collection('users');

        // Находим текущего пользователя
        const currentUser = await usersCollection.findOne({ email: currentUserEmail });
        if (!currentUser) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        // Получаем список email пользователей, на которых подписан текущий пользователь
        const subscriptions = currentUser.subscriptions;

        // Находим пользователей по их email
        const subscribedUsers = await usersCollection.find({ email: { $in: subscriptions } }).toArray();

        return NextResponse.json(subscribedUsers, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении подписанных пользователей:', error);
        return NextResponse.json({ error: 'Ошибка при получении подписанных пользователей' }, { status: 500 });
    } finally {
        await client.close();
    }
}
