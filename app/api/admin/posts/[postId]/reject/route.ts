import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function PUT(
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

    const params = await context.params;
    const postId = params.postId;
    const { reason } = await req.json();

    if (!reason) {
        return NextResponse.json({ error: 'Причина отклонения не указана' }, { status: 400 });
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('local');
        const postsCollection = database.collection('posts');
        const usersCollection = database.collection('users');

        const existingPost = await postsCollection.findOne({ 
            _id: new ObjectId(postId) 
        });

        if (!existingPost) {
            await client.close();
            return NextResponse.json({ error: 'Пост не найден' }, { status: 404 });
        }

        await postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            { $set: { status: 'Отклонен' } }
        );

        await usersCollection.updateOne(
            { username: existingPost.author },
            { 
                $push: { 
                    notifications: { 
                        message: `Ваш пост "${existingPost.title}" был отклонен. Причина: ${reason}`, 
                        createdAt: new Date().toISOString()
                    } as any
                } 
            } 
        );

        await client.close();
        return NextResponse.json({ message: 'Пост отклонен успешно' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при отклонении поста:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}