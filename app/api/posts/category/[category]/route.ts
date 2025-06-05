import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function GET(
  req: NextRequest,
  context: { params: Promise<any> }
) {
  const params = await context.params;
  const category = params.category;
  
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
    
    // Используем агрегацию для сортировки по количеству лайков и комментариев
    const posts = await postsCollection.aggregate([
      // Фильтруем по категории и статусу
      { 
        $match: { 
          category: decodedCategory,
          status: 'Опубликован' 
        } 
      },
      // Добавляем поле с количеством комментариев
      { 
        $addFields: { 
          commentsCount: { $size: { $ifNull: ["$comments", []] } }
        } 
      },
      // Сортируем по лайкам, комментариям и дате
      { 
        $sort: { 
          likeCount: -1,     // Сначала по количеству лайков (по убыванию)
          commentsCount: -1, // Потом по количеству комментариев (по убыванию)
          createdAt: -1      // Затем по дате создания (по убыванию)
        } 
      }
    ]).toArray();
    
    await client.close();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Ошибка при получении постов по категории:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 