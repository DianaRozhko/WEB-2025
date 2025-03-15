// user-service/main.ts
import * as dotenv from 'dotenv';
dotenv.config(); // Підхоплює .env з кореня (або вкажіть { path: './user-service/.env' } за потреби)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Створюємо Nest-застосунок
  const app = await NestFactory.create(AppModule);

  // Підключаємо мікросервіс RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // Адреса вашого RabbitMQ
      queue: 'user_queue',             // Черга, що слухає user-service
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  // HTTP-сервер user-service (якщо треба викликати напряму)
  // Можна слухати інший порт, головне, щоби він не конфліктував з gateway
  await app.listen(3001);
}
bootstrap();
