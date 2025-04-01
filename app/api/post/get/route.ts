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
        const postsCollection = database.collection('posts');

        const userPosts = await postsCollection.find({ author: currentUserEmail }).toArray();
        await client.close();

        return NextResponse.json(userPosts, { status: 200 });
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
