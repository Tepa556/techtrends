import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URL!;
const jwtSecret = process.env.JWT_SECRET!;

export async function POST(request: NextRequest, { params }: { params: { userEmail: string } }) {
    const { email: currentUserEmail } = await request.json(); // Получаем email текущего пользователя
    const client = new MongoClient(uri); // Declare and initialize client here

    try {
        await client.connect();
        const database = client.db('local'); // Укажите имя вашей базы данных
        const usersCollection = database.collection('users');

        // Проверяем, существует ли пользователь
        const user = await usersCollection.findOne({ email: params.userEmail });
        const subscriber = await usersCollection.findOne({ email: currentUserEmail });

        if (!user || !subscriber) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        // Добавляем подписчика
        await usersCollection.updateOne(
            { email: params.userEmail },
            { $addToSet: { subscribers: currentUserEmail } } // Используем $addToSet, чтобы избежать дубликатов
        );
        await usersCollection.updateOne(
            { email: currentUserEmail },
            { $addToSet: { subscriptions: params.userEmail } }
        );

        return NextResponse.json({ message: 'Подписка добавлена' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Ошибка при добавлении подписки' }, { status: 500 });
    } finally {
        await client.close(); // Now client is defined in this scope
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { userEmail: string } }) {
    const { email: currentUserEmail } = await request.json(); // Получаем email текущего пользователя
    const client = new MongoClient(uri); // Declare and initialize client here

    try {
        await client.connect();
        const database = client.db('local'); // Укажите имя вашей базы данных
        const usersCollection = database.collection('users');

        // Проверяем, существует ли пользователь
        const user = await usersCollection.findOne({ email: params.userEmail });
        const subscriber = await usersCollection.findOne({ email: currentUserEmail });

        if (!user || !subscriber) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        // Удаляем подписчика
        await usersCollection.updateOne(
            { email: params.userEmail },
            { $pull: { subscribers: currentUserEmail } }
        );
        await usersCollection.updateOne(
            { email: currentUserEmail },
            { $pull: { subscriptions: params.userEmail } }
        );

        return NextResponse.json({ message: 'Подписка удалена' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Ошибка при удалении подписки' }, { status: 500 });
    } finally {
        await client.close(); // Now client is defined in this scope
    }
}
