// api-gateway/src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';

// Завантаження змінних середовища з файлу .env
dotenv.config();

@Injectable()
// JwtStrategy визначає, як вилучати і перевіряти JWT із запиту.
// Вона використовує секретний ключ із змінних середовища для валідації підпису токена.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Отримуємо секретний ключ із змінних середовища
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in .env');
    }
    super({
      // Вилучення токена з заголовку Authorization у форматі "Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Не ігнорувати термін дії токена
      secretOrKey: secret,     // Використовувати секретний ключ для перевірки підпису
    });
  }

  // Метод validate викликається, якщо токен валідний.
  // Він повертає об'єкт, який NestJS зберігає як req.user.
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
