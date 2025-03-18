// user-service/src/user/user.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';  // Модуль для роботи з JWT
import { PassportModule } from '@nestjs/passport';  // Модуль для інтеграції Passport (аутентифікація)
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from './auth/auth.service';
import { User } from './user.entity';

@Module({
  imports: [
    PassportModule,
    // Налаштування JwtModule з використанням змінних середовища
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Секретний ключ для підпису JWT (з .env)
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },  // Термін дії токена
    }),
    // Підключаємо TypeOrmModule для роботи з сутністю User
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController], // Контролер, що обробляє повідомлення
  providers: [UserService, AuthService], // Провайдери: сервіс для користувачів та сервіс аутентифікації
  exports: [UserService, AuthService], // Експортуємо, щоб інші модулі могли їх використовувати, якщо потрібно
})
export class UserModule {}
