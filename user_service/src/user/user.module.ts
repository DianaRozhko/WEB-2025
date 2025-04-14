// user-service/src/user/user.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { User } from './user.entity';

@Module({
  imports: [
    // Для авторизації
    PassportModule,

    // JWT конфігурація з .env
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN  },
      })
    }),

    // Доступ до таблиці `users`
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService, AuthService],
})
export class UserModule {}
