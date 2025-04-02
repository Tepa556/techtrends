import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminCredentials } from '../../../lib/adminConfig';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        
        // Проверяем учетные данные администратора
        if (email === adminCredentials.email && password === adminCredentials.password) {
            // Создаем JWT токен с ролью администратора
            const token = jwt.sign({ 
                email, 
                role: 'admin'
            }, process.env.JWT_SECRET || '', {
                expiresIn: '1d' // Токен действителен 1 день
            });
            
            return NextResponse.json({ token });
        } else {
            return NextResponse.json({ error: 'Неверные учетные данные' }, { status: 401 });
        }
    } catch (error) {
        console.error('Ошибка при входе администратора:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}