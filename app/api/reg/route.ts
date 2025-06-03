    import { NextRequest, NextResponse } from 'next/server';
    import { MongoClient } from 'mongodb';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';


    const uri = `${process.env.MONGODB_URL}`;
    const jwtSecret = `${process.env.JWT_SECRET}`;

    // Экспортируем именованную функцию для POST-запроса
    export async function POST(req: NextRequest) {
        const { username, email, password, phone } = await req.json();

        if (!username || !email || !password || !phone) {
            return NextResponse.json({ error: 'Все поля обязательны для заполнения' }, { status: 400 });
        }

        const client = new MongoClient(uri);

        try {
            await client.connect();
            const database = client.db('local');
            const usersCollection = database.collection('users');

            // Проверка уникальности email
            const existingEmail = await usersCollection.findOne({ email });
            if (existingEmail) {
                return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
            }

            // Проверка уникальности никнейма
            const existingUsername = await usersCollection.findOne({ username });
            if (existingUsername) {
                return NextResponse.json({ error: 'Пользователь с таким никнеймом уже существует' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                username,
                email,
                password: hashedPassword,
                phone,
                avatar:"/user-avatar/default-avatar.jpg",
                subscribers:[],
                subscriptions: [], 
                posts: [],         
                notifications: [],  
                createdAt: new Date(),
            };

            await usersCollection.insertOne(newUser);

            // Создание токена
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: '3h' });

            return NextResponse.json({ message: 'Регистрация успешна', token }, { status: 201 });
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
        } finally {
            await client.close();
        }
    }
