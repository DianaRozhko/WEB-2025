// user-service/src/user/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Перевіряє email та пароль користувача, повертає сутність User, якщо все вірно.
   */
  async validateUser(email: string, rawPassword: string): Promise<User | null> {
    // Знаходимо користувача за email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Не знайдено користувача з таким email
      return null;
    }

    // Порівнюємо відкритий пароль з хешем у БД
    const passwordMatches = await bcrypt.compare(rawPassword, user.password);
    if (!passwordMatches) {
      // Пароль невірний
      return null;
    }
    // Якщо все гаразд, повертаємо користувача
    return user;
  }

  /**
   * Формує та повертає JWT-токен для авторизованого користувача.
   */
  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role, // 👈 додаємо роль до токена
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
}
