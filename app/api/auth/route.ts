import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

// Экспортируем именованную функцию для POST-запроса
export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Все поля обязательны для заполнения' }, { status: 400 });
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
        }

        // Создание токена
        const token = jwt.sign({ email }, jwtSecret, { expiresIn: '3h' });

        return NextResponse.json({ message: 'Авторизация успешна', token }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    } finally {
        await client.close();
    }
}
