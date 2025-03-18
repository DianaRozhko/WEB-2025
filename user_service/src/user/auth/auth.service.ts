// user-service/src/user/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
// Сервіс для аутентифікації користувачів. Він перевіряє облікові дані і генерує JWT.
export class AuthService {
  constructor(
    private readonly usersService: UserService, // Використовується для пошуку користувача
    private readonly jwtService: JwtService,     // Використовується для генерації JWT
  ) {}

  /**
   * validateUser перевіряє, чи існує користувач із заданим email і чи співпадає пароль.
   * Повертає користувача, якщо валідація пройшла успішно, або null інакше.
   */
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    return isMatch ? user : null;
  }

  /**
   * login генерує JWT на основі інформації про користувача.
   * Повертає об'єкт з access_token.
   */
  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
