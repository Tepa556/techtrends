import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

// Проверка статуса лайка
export async function GET(
  req: NextRequest,
  context: { params: Promise<any> }
) {
  const params = await context.params;
  const postId = params.postId;
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
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('local');
    const usersCollection = database.collection('users');
    const postsCollection = database.collection('posts');

    // Находим пользователя по email
    const user = await usersCollection.findOne({ email: currentUserEmail });
    if (!user) {
      await client.close();
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Находим пост
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      await client.close();
      return NextResponse.json({ error: 'Пост не найден' }, { status: 404 });
    }

    // Проверяем, поставил ли пользователь лайк
    const likes = post.likes || [];
    const isLiked = likes.some((like: any) => like.username === user.username);

    await client.close();
    return NextResponse.json({ isLiked }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при проверке статуса лайка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 