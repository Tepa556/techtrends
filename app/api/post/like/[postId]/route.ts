import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

// Добавление/удаление лайка
export async function POST(
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
    const postsCollection = database.collection('posts');
    const usersCollection = database.collection('users');

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

    // Инициализируем массив лайков, если его нет
    const likes = post.likes || [];
    const username = user.username;
    
    // Проверяем, поставил ли пользователь уже лайк
    const userLikeIndex = likes.findIndex((like: any) => like.username === username);
    let liked = false;

    if (userLikeIndex !== -1) {
      // Если лайк уже есть - удаляем
      likes.splice(userLikeIndex, 1);
    } else {
      // Если лайка нет - добавляем
      likes.push({
        username: username,
        createdAt: new Date().toISOString()
      });
      liked = true;
    }

    // Обновляем лайки и их количество в посте
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { 
        $set: { 
          likes: likes,
          likeCount: likes.length 
        } 
      }
    );

    await client.close();
    return NextResponse.json({ liked, likeCount: likes.length }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при изменении лайка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 