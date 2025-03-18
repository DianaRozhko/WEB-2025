// user-service/src/main.ts

// Завантажуємо змінні середовища з файлу .env (наприклад, секретні ключі, налаштування БД тощо)
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';  // Для валідації DTO

async function bootstrap() {
  // Створення основного NestJS застосунку з основним модулем AppModule
  const app = await NestFactory.create(AppModule);

  // Глобальний ValidationPipe застосовується до HTTP-запитів (але для мікросервісних повідомлень треба застосовувати на рівні контролера)
  app.useGlobalPipes(new ValidationPipe());

  // Налаштовуємо мікросервісний транспорт для роботи з RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      // URL до RabbitMQ (наприклад, локальний сервер)
      urls: ['amqp://localhost:5672'],
      // Назва черги, яку слухає User Service
      queue: 'user_queue',
      queueOptions: {
        // durable: false означає, що черга не зберігається після перезапуску брокера
        durable: false,
      },
    },
  });

  // Запускаємо всі мікросервісні підключення
  await app.startAllMicroservices();

  // Запускаємо HTTP сервер на порту 3001 (для прямого HTTP-тестування, якщо потрібно)
  await app.listen(3001);
}
bootstrap();
