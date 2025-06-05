import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function GET() {
    const client = new MongoClient(uri);
    try {
        // Connect to the client
        await client.connect();

        // Access the database and collection
        const database = client.db('local');
        const collection = database.collection('posts');

        // Используем агрегацию для сортировки по количеству лайков и комментариев
        const posts = await collection.aggregate([
            // Фильтруем только опубликованные посты
            { $match: { status: 'Опубликован' } },
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

        // Modify URLs of images - просто добавляем префикс /post-back/
        const modifiedPosts = posts.map(post => ({
            ...post,
            image: post.image ? `/post-back/${post.image}` : null
        }));

        // Return response using NextResponse
        return NextResponse.json(modifiedPosts);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return NextResponse.json(
            { error: 'Error connecting to MongoDB' },
            { status: 500 }
        );
    } finally {
        // Close the connection
        await client.close();
    }
}
