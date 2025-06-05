import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
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
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');
        const postsCollection = database.collection('posts');

        // Находим пользователя по email, чтобы получить username
        const user = await usersCollection.findOne({ email: currentUserEmail });
        if (!user) {
            await client.close();
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        // Ищем посты по username пользователя с сортировкой по популярности
        const userPosts = await postsCollection.aggregate([
            // Фильтруем посты по автору
            { 
                $match: { 
                    author: user.username 
                } 
            },
            // Добавляем поле с количеством комментариев
            { 
                $addFields: { 
                    commentsCount: { $size: { $ifNull: ["$comments", []] } }
                } 
            },
            // Сортируем по лайкам, комментариям и дате
            { 
                $sort: { 
                    likeCount: -1,     // Сначала по количеству лайков (по убыванию)
                    commentsCount: -1, // Потом по количеству комментариев (по убыванию)
                    createdAt: -1      // Затем по дате создания (по убыванию)
                } 
            }
        ]).toArray();
        await client.close();

        return NextResponse.json(userPosts, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
