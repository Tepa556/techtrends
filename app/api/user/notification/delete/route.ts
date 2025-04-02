import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function DELETE(req: NextRequest) {
    // Проверка токена
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    let userEmail;
    
    try {
        const decoded = jwt.verify(token, jwtSecret) as { email: string };
        userEmail = decoded.email;
    } catch (error) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }
    
    // Получение индекса уведомления из тела запроса
    const { notificationIndex } = await req.json();
    
    if (notificationIndex === undefined) {
        return NextResponse.json({ error: 'Индекс уведомления не указан' }, { status: 400 });
    }
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');
        
        // Получаем пользователя
        const user = await usersCollection.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }
        
        // Проверяем, существует ли уведомление с указанным индексом
        if (!user.notifications || notificationIndex >= user.notifications.length) {
            return NextResponse.json({ error: 'Уведомление не найдено' }, { status: 404 });
        }
        
        // Удаляем уведомление по индексу
        const updatedNotifications = [...user.notifications];
        updatedNotifications.splice(notificationIndex, 1);
        
        // Обновляем документ пользователя
        await usersCollection.updateOne(
            { email: userEmail },
            { $set: { notifications: updatedNotifications } }
        );
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении уведомления:', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    } finally {
        await client.close();
    }
}