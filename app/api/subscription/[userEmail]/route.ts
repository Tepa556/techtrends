import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;
export async function POST(
  request: NextRequest, 
  context: { params: Promise<{ userEmail: string }>  }
) {
    // Сначала получаем параметры из Promise
    const params = await context.params;
    const targetUserEmail = params.userEmail;
    
    const authHeader = request.headers.get('Authorization');
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
        const database = client.db('local');
        const usersCollection = database.collection('users');

        // Проверяем, существует ли пользователь
        const user = await usersCollection.findOne({ email: targetUserEmail });
        const subscriber = await usersCollection.findOne({ email: currentUserEmail });

        if (!user || !subscriber) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        // Добавляем подписчика
        await usersCollection.updateOne(
            { email: targetUserEmail },
            { $addToSet: { subscribers: currentUserEmail } } // Используем $addToSet, чтобы избежать дубликатов
        );
        await usersCollection.updateOne(
            { email: currentUserEmail },
            { $addToSet: { subscriptions: targetUserEmail } }
        );

        return NextResponse.json({ message: 'Подписка добавлена' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Ошибка при добавлении подписки' }, { status: 500 });
    } finally {
        await client.close(); // Now client is defined in this scope
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ userEmail: string }> }
) {
    try {
        const params = await context.params;
        const userEmail = params.userEmail;
        
        const authHeader = request.headers.get('Authorization');
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
            const database = client.db('local');
            const usersCollection = database.collection('users');

            // Проверяем, существует ли пользователь
            const user = await usersCollection.findOne({ email: userEmail });
            const subscriber = await usersCollection.findOne({ email: currentUserEmail });

            if (!user || !subscriber) {
                return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
            }

            // Удаляем подписчика
            await usersCollection.updateOne(
                { email: userEmail },
                { $pull: { subscribers: currentUserEmail } as any }
            );
            await usersCollection.updateOne(
                { email: currentUserEmail },
                { $pull: { subscriptions: userEmail } as any }
            );

            return NextResponse.json({ message: 'Successfully unsubscribed' });
        } catch (error) {
            console.error('Error unsubscribing:', error);
            return NextResponse.json(
                { error: 'Failed to unsubscribe' },
                { status: 500 }
            );
        } finally {
            await client.close(); // Now client is defined in this scope
        }
    } catch (error) {
        console.error('Error in DELETE:', error);
        return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
        );
    }
}