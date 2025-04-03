import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function POST(req: NextRequest) {
  let author;
  try {
    const body = await req.json();
    author = body.author;
    
    if (!author) {
      return NextResponse.json({ error: 'Имя пользователя не указано' }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('local');
    const usersCollection = database.collection('users');

    // Находим пользователя по username
    const user = await usersCollection.findOne({ username: author });

    await client.close();

    if (!user) {
      return NextResponse.json(
        { username: author, avatar: '/user-avatar/default-avatar.jpg' }, 
        { status: 200 }
      );
    }

    // Проверяем наличие поля avatar, если его нет - используем аватар по умолчанию
    const userData = {
      username: user.username,
      avatar: user.avatar
    };

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { username: author || 'unknown', avatar: '/user-avatar/default-avatar.jpg' }, 
      { status: 200 }
    );
  }
}