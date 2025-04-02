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
        currentUserEmail = decoded.email; // Извлекаем email из декодированного токена
    } catch (error) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const postsCollection = database.collection('posts');

        // Получаем все посты
        const posts = await postsCollection.find().toArray();
        await client.close();

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
} 