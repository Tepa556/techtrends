import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

// Удаление комментария
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<any> }
) {
  const params = await context.params;
  const postId = params.postId;
  const commentId = params.commentId;
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

    // Находим пост и его комментарии
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      await client.close();
      return NextResponse.json({ error: 'Пост не найден' }, { status: 404 });
    }

    const comment = post.comments?.find((c: any) => c._id === commentId);
    if (!comment) {
      await client.close();
      return NextResponse.json({ error: 'Комментарий не найден' }, { status: 404 });
    }

    // Проверяем права на удаление (автор комментария или админ)
    const isAdmin = user.role === 'admin'; // Если у вас есть такое поле
    if (comment.author !== user.username && !isAdmin) {
      await client.close();
      return NextResponse.json({ error: 'У вас нет прав на удаление этого комментария' }, { status: 403 });
    }

    // Удаляем комментарий
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { comments: { _id: commentId } } } as any
    );

    await client.close();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при удалении комментария:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 
