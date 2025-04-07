import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function GET(
  req: NextRequest,
  context: { params: Promise<any> }
) {
  const params = await context.params;
  const userId = params.id;
  
  try {
    // Проверка JWT токена
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Токен авторизации не предоставлен' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Проверяем токен
      jwt.verify(token, jwtSecret);
    } catch (error) {
      return NextResponse.json({ error: 'Неверный токен авторизации' }, { status: 401 });
    }
    
    const userId = await params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя не указан' }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('local');
    
    // Находим пользователя, чтобы получить его username
    const usersCollection = database.collection('users');
    let user;
    
    try {
      user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    } catch (error) {
      return NextResponse.json({ error: 'Неверный формат ID пользователя' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Получаем посты пользователя по его username
    const postsCollection = database.collection('posts');
    const posts = await postsCollection.find({ 
      author: user.username 
    }).toArray();
    
    await client.close();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Ошибка при получении постов пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 