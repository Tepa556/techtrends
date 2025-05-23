import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;
const UPLOAD_DIR = path.join(process.cwd(), 'public/post-back');

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    },
};

export async function POST(req: NextRequest) {
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
        const { title, description, category, text, image } = await req.json();

        if (!title || !description || !category || !text) {
            return NextResponse.json({ error: 'Все поля обязательны для заполнения' }, { status: 400 });
        }

        let imageUrl = null;

        if (image) {
            const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return NextResponse.json({ error: 'Неверный формат изображения' }, { status: 400 });
            }

            const mimeType = matches[1];
            const base64Data = matches[2];
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(mimeType)) {
                return NextResponse.json({ error: 'Допустимые форматы: JPEG, PNG' }, { status: 400 });
            }

            const buffer = Buffer.from(base64Data, 'base64');
            if (buffer.length > 2 * 1024 * 1024) {
                return NextResponse.json({ error: 'Размер изображения превышает 2MB' }, { status: 400 });
            }

            await fs.mkdir(UPLOAD_DIR, { recursive: true });

            const ext = mimeType.split('/')[1];
            const fileName = `${uuidv4()}.${ext}`;
            const filePath = path.join(UPLOAD_DIR, fileName);

            await fs.writeFile(filePath, buffer);
            imageUrl = `/post-back/${fileName}`;
        }

        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const postsCollection = database.collection('posts');
        const usersCollection = database.collection('users');

        // Находим пользователя по email и получаем его username
        const user = await usersCollection.findOne({ email: currentUserEmail });
        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        const newPost = {
            title,
            description,
            category,
            text,
            imageUrl,
            author: user.username,
            likeCount: 0,
            comments: [],
            status: "На рассмотрении",
            createdAt: new Date().toISOString(),
        };

        await postsCollection.insertOne(newPost);

        // Получаем подписчиков текущего пользователя
        if (user?.subscribers && user.subscribers.length > 0) {
            await usersCollection.updateMany(
                { email: { $in: user.subscribers } },
                { $push: { notifications: { message: `Новый пост от ${user.username}: "${title}"`, createdAt: new Date().toISOString() } }as any }
            );
        }

        await client.close();

        return NextResponse.json({ 
            message: 'Пост успешно создан',
            post: newPost
        });
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}
