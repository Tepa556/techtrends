import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function GET() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('local');
        const collection = database.collection('posts');

        // Получаем все опубликованные посты, отсортированные по дате создания
        const allPosts = await collection.find({ 
            status: 'Опубликован' 
        }).sort({ 
            createdAt: -1 
        }).toArray();

        // Выбираем по одному посту из каждой категории (максимум 3)
        const recentPosts: any[] = [];
        const usedCategories = new Set<string>();

        for (const post of allPosts) {
            if (!usedCategories.has(post.category) && recentPosts.length < 3) {
                recentPosts.push({
                    ...post,
                    image: post.image ? `/post-back/${post.image}` : null
                });
                usedCategories.add(post.category);
            }
        }

        return NextResponse.json(recentPosts);
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        return NextResponse.json(
            { error: 'Error fetching recent posts' },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
} 