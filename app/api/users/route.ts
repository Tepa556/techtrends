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
    try {
        const decoded = jwt.verify(token, jwtSecret) as { email: string };
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');

        const currentUser = await usersCollection.findOne({ email: decoded.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        const users = await usersCollection.find({ _id: { $ne: currentUser._id } }).toArray();

        await client.close();

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }
}