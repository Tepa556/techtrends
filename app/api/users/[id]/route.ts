import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function GET(
  req: NextRequest,
  context: { params: Promise<any> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID пользователя не указан' }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('local');
    const usersCollection = database.collection('users');

    // Проверяем, является ли ID валидным ObjectId
    let user;
    try {
      user = await usersCollection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      return NextResponse.json({ error: 'Неверный формат ID пользователя' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    await client.close();

    // Возвращаем данные пользователя без конфиденциальной информации
    return NextResponse.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      subscribers: user.subscribers || [],
      subscriptions: user.subscriptions || []
    });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
} 