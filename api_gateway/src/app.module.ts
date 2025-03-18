// api-gateway/src/app.module.ts

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';  // Модуль для інтеграції Passport
import { JwtModule } from '@nestjs/jwt';            // Модуль для роботи з JWT
import { JwtStrategy } from './auth/jwt.strategy';  // Стратегія для перевірки JWT

@Module({
  imports: [
    // Налаштовуємо клієнта для взаємодії з USER_SERVICE через RabbitMQ
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Адреса RabbitMQ
          queue: 'user_queue',             // Черга, яку слухає User Service
          queueOptions: { durable: false },
        },
      },
    ]),
    // Підключаємо PassportModule для аутентифікації
    PassportModule,
    // Налаштовуємо JwtModule із секретним ключем та часом дії токена з .env
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Секретний ключ для підпису JWT
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AppController], // Контролер, що визначає HTTP-маршрути
  providers: [AppService, JwtStrategy], // Провайдери: бізнес-логіка та стратегія перевірки JWT
})
export class AppModule {}
