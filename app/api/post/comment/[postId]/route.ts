import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
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

  const { text, parentId } = await req.json();
  if (!text || text.trim() === '') {
    return NextResponse.json({ error: 'Текст комментария не может быть пустым' }, { status: 400 });
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

    // Если это ответ на комментарий, проверяем существование родительского комментария
    if (parentId) {
      const parentExists = post.comments?.some((comment: any) => comment._id === parentId);
      if (!parentExists) {
        await client.close();
        return NextResponse.json({ error: 'Родительский комментарий не найден' }, { status: 404 });
      }
    }

    // Создаем новый комментарий
    const newComment = {
      _id: new ObjectId().toString(),
      text,
      author: user.username,
      authorAvatar: user.avatar || '/user-avatar/default-avatar.jpg',
      createdAt: new Date().toISOString(),
      parentId: parentId || null,
    };

    // Убеждаемся, что массив комментариев существует
    if (!Array.isArray(post.comments)) {
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $set: { comments: [] } }
      );
    }

    // Добавляем новый комментарий в массив комментариев
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          comments: newComment
        } as any
      }
    );

    await client.close();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Ошибка при добавлении комментария:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
