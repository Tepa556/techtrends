import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        jwt.verify(token, jwtSecret);
    } catch (error) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }

    try {
        const { subscriptions } = await req.json();
        
        if (!subscriptions || !Array.isArray(subscriptions) || subscriptions.length === 0) {
            return NextResponse.json([]);
        }

        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');

        // Получаем данные о пользователях по их email
        const users = await usersCollection.find({ 
            email: { $in: subscriptions } 
        }).project({
            email: 1,
            username: 1,
            avatar: 1,
            _id: 1
        }).toArray();

        await client.close();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Ошибка при получении данных о подписках:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
} 