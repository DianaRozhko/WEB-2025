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
   * Перевіряє email та пароль, повертає користувача, якщо облікові дані вірні.
   */
  async validateUser(email: string, pass: string): Promise<User | null> {
    // Шукаємо користувача в базі за email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null; // Користувача не знайдено
    }

    // Порівнюємо переданий пароль з хешованим у базі (bcrypt.compare)
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null; // Пароль неправильний
    }

    // Якщо все гаразд - повертаємо користувача
    return user;
  }

  /**
   * Генерує JWT на основі даних користувача.
   */
  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
