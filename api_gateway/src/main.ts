// api-gateway/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Створюємо основний NestJS застосунок з використанням AppModule
  const app = await NestFactory.create(AppModule);


  // Підключаємо мікросервіс, що використовує RabbitMQ як транспортний шар,
  // що дозволяє API Gateway отримувати повідомлення від інших сервісів (наприклад, user-service)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // Адреса RabbitMQ
      queue: 'gateway_queue',          // Назва черги, яку слухає API Gateway
      queueOptions: { durable: false },  // Черга не зберігається після перезапуску брокера
    },
  });

  // Запускаємо всі мікросервісні підключення та HTTP сервер на порту 3002
  await app.startAllMicroservices();
  await app.listen(3002);
  console.log('API Gateway is running on port 3002');
}
bootstrap();
