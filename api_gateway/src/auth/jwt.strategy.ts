// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config(); // Зчитує змінні середовища з .env у поточній папці (або вкажіть { path: ... })

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET; // Читаємо з env
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in .env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Тепер точно рядок, а не undefined
    });
  }

  async validate(payload: any) {
    // У payload зазвичай лежить { email, sub, iat, exp, ... }
    // Ви можете повернути будь-які поля, які треба зберегти у req.user
    return { userId: payload.sub, email: payload.email };
  }
}
