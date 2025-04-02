import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'post-back');

export async function PUT(req: NextRequest) {
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

    try {
        const { postId, title, description, category, text, image } = await req.json();

        if (!postId || !title || !description || !category || !text) {
            return NextResponse.json({ error: 'Все поля обязательны для заполнения' }, { status: 400 });
        }

        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const postsCollection = database.collection('posts');

        // Проверяем, существует ли пост и принадлежит ли он текущему пользователю
        const existingPost = await postsCollection.findOne({ 
            _id: new ObjectId(postId),
            author: currentUserEmail 
        });

        if (!existingPost) {
            await client.close();
            return NextResponse.json({ error: 'Пост не найден или у вас нет прав для его редактирования' }, { status: 404 });
        }

        // Обрабатываем новое изображение, если оно было предоставлено
        let imageUrl = existingPost.imageUrl;

        if (image && image !== existingPost.imageUrl) {
            // Если это base64 строка, значит это новое изображение
            if (image.startsWith('data:')) {
                const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    await client.close();
                    return NextResponse.json({ error: 'Неверный формат изображения' }, { status: 400 });
                }

                const mimeType = matches[1];
                const base64Data = matches[2];
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (!allowedTypes.includes(mimeType)) {
                    await client.close();
                    return NextResponse.json({ error: 'Допустимые форматы: JPEG, PNG' }, { status: 400 });
                }

                const buffer = Buffer.from(base64Data, 'base64');
                if (buffer.length > 2 * 1024 * 1024) {
                    await client.close();
                    return NextResponse.json({ error: 'Размер изображения превышает 2MB' }, { status: 400 });
                }

                await fs.mkdir(UPLOAD_DIR, { recursive: true });

                // Удаляем старое изображение, если оно существует
                if (existingPost.imageUrl) {
                    const oldImagePath = path.join(process.cwd(), 'public', existingPost.imageUrl);
                    try {
                        await fs.access(oldImagePath); // Проверяем, существует ли файл
                        await fs.unlink(oldImagePath); // Удаляем файл
                    } catch (error) {
                        console.error('Ошибка при удалении старого изображения:', error);
                        // Продолжаем выполнение, даже если не удалось удалить старое изображение
                    }
                }

                const ext = mimeType.split('/')[1];
                const fileName = `${uuidv4()}.${ext}`;
                const filePath = path.join(UPLOAD_DIR, fileName);

                await fs.writeFile(filePath, buffer);
                imageUrl = `/post-back/${fileName}`;
            }
        }

        // Обновляем пост
        const updateResult = await postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            { 
                $set: {
                    title,
                    description,
                    category,
                    text,
                    imageUrl,
                    updatedAt: new Date().toISOString()
                } 
            }
        );

        if (updateResult.modifiedCount === 0) {
            await client.close();
            return NextResponse.json({ error: 'Не удалось обновить пост' }, { status: 500 });
        }

        // Получаем обновленный пост
        const updatedPost = await postsCollection.findOne({ _id: new ObjectId(postId) });
        
        await client.close();
        return NextResponse.json({ 
            message: 'Пост успешно обновлен',
            post: updatedPost
        });
    } catch (error) {
        console.error('Ошибка при обновлении поста:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
