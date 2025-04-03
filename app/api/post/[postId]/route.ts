import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const postId = (await params).postId;
  
  if (!postId) {
    return NextResponse.json({ error: 'ID поста не указан' }, { status: 400 });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('local');
    const postsCollection = database.collection('posts');

    // Проверяем валидность ObjectId
    let objectId;
    try {
      objectId = new ObjectId(postId);
    } catch (error) {
      return NextResponse.json({ error: 'Некорректный ID поста' }, { status: 400 });
    }

    // Находим пост по ID
    const post = await postsCollection.findOne({ _id: objectId });
    
    await client.close();

    if (!post) {
      return NextResponse.json({ error: 'Пост не найден' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Ошибка при получении поста:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}