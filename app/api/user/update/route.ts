import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

// Отключаем встроенный парсер тела запроса
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function PUT(req: NextRequest) {
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

    // Создание директории для аватаров
    const avatarDir = path.join(process.cwd(), 'public', 'user-avatar');
    if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true });
    }

    // Получаем данные из JSON
    const { username, email, avatarBase64 } = await req.json();
    
    // Обработка аватара
    let avatarPath = null;
    if (avatarBase64) {
        // Обрабатываем base64 строку
        const matches = avatarBase64.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const ext = mimeType.split('/')[1];
            const fileName = `${Date.now()}.${ext}`;
            const newPath = path.join(avatarDir, fileName);
            
            fs.writeFileSync(newPath, Buffer.from(base64Data, 'base64'));
            avatarPath = `/user-avatar/${fileName}`;
        }
    }

    // Подключение к MongoDB
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');

        // Проверяем существование пользователя
        const user = await usersCollection.findOne({ email: currentUserEmail });
        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        // Подготовка данных для обновления
        const updateData: any = {
            username: username,
            email: email,
        };

        // Если пользователь загрузил новый аватар
        if (avatarPath) {
            updateData.avatar = avatarPath;
            
            // Удаляем старый аватар, если он существует
            if (user.avatar && !user.avatar.includes('default-avatar')) {
                const oldAvatarPath = path.join(process.cwd(), 'public', user.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }
        }

        // Обновляем профиль пользователя
        await usersCollection.updateOne({ email: currentUserEmail }, { $set: updateData });

        // Возвращаем обновленные данные пользователя
        const updatedUser = await usersCollection.findOne({ email: currentUserEmail });
        await client.close();
        return NextResponse.json({ 
            message: 'Профиль обновлен успешно',
            user: updatedUser 
        });
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
