import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

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

    const form = formidable({ multiples: false });
    const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            } else {
                resolve({ fields, files });
            }
        });
    });

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('local');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ email: currentUserEmail });
        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
        }

        const updateData: any = {
            username: fields.username,
            email: fields.email,
        };

        if (files.avatar) {
            const avatarPath = `/user-avatar/${files.avatar[0].originalFilename}`;
            fs.renameSync(files.avatar[0].filepath, `./public${avatarPath}`);
            updateData.avatar = avatarPath;
        }

        await usersCollection.updateOne({ email: currentUserEmail }, { $set: updateData });

        return NextResponse.json({ message: 'Профиль обновлен' });
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    } finally {
        await client.close();
    }
}
