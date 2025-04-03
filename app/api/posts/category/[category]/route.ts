import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  const category = await params.category;
  
  if (!category) {
    return NextResponse.json({ error: 'Категория не указана' }, { status: 400 });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('local');
    const postsCollection = database.collection('posts');

    // Декодируем URL-параметр (например, 'веб-разработка')
    const decodedCategory = decodeURIComponent(category);
    
    // Ищем все посты с указанной категорией
    const posts = await postsCollection.find({ 
      category: decodedCategory,
      status: 'Опубликован' 
    }).toArray();
    
    await client.close();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Ошибка при получении постов по категории:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 