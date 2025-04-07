import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
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

    // Получаем id поста из параметров маршрута
    const params = await context.params;
    const postId = params.postId;

    if (!postId) {
        return NextResponse.json({ error: 'ID поста не указан' }, { status: 400 });
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const postsCollection = database.collection('posts');
        const usersCollection = database.collection('users');

        // Находим пользователя
        const user = await usersCollection.findOne({ email: currentUserEmail });
        if (!user) {
            await client.close();
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        // Сначала проверяем существование поста
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
        
        if (!post) {
            await client.close();
            return NextResponse.json({ error: 'Пост не найден' }, { status: 404 });
        }

        // Удаляем изображение поста, если оно существует
        if (post.imageUrl) {
            const imagePath = path.join(process.cwd(), 'public', post.imageUrl);
            try {
                await fs.access(imagePath); // Проверяем, существует ли файл
                await fs.unlink(imagePath); // Удаляем файл
            } catch (error) {
                console.error('Ошибка при удалении изображения поста:', error);
                // Продолжаем выполнение, даже если не удалось удалить изображение
            }
        }

        // Удаляем пост
        const deleteResult = await postsCollection.deleteOne({ _id: new ObjectId(postId) });

        if (deleteResult.deletedCount === 0) {
            await client.close();
            return NextResponse.json({ error: 'Не удалось удалить пост' }, { status: 500 });
        }

        await client.close();
        return NextResponse.json({ message: 'Пост успешно удален' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
