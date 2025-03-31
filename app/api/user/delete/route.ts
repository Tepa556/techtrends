import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function DELETE(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let currentUserEmail;

    try {
        const decoded = jwt.verify(token, jwtSecret) as { email: string };
        currentUserEmail = decoded.email;
    } catch (error) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ email: currentUserEmail });
        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        // Удаляем пользователя и все связанные данные
        await usersCollection.deleteOne({ email: currentUserEmail });

        return NextResponse.json({ message: 'Аккаунт удален' });
    } catch (error) {
        console.error('Ошибка при удалении аккаунта:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    } finally {
        await client.close();
    }
}
