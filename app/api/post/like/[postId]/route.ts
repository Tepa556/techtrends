import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

// Добавление/удаление лайка
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const postId = (await params).postId;
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
    const likesCollection = database.collection('likes');

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

    // Проверяем, поставил ли пользователь уже лайк
    const existingLike = await likesCollection.findOne({
      postId: postId,
      username: user.username
    });

    let liked = false;
    let likeCount = post.likeCount || 0;

    if (existingLike) {
      // Если лайк уже есть - удаляем
      await likesCollection.deleteOne({
        postId: postId,
        username: user.username
      });
      
      likeCount -= 1;
    } else {
      // Если лайка нет - добавляем
      await likesCollection.insertOne({
        postId: postId,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      
      likeCount += 1;
      liked = true;
    }

    // Обновляем количество лайков в посте
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { likeCount: likeCount } }
    );

    await client.close();
    return NextResponse.json({ liked, likeCount }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при изменении лайка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 