// api-gateway/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Підключаємо RabbitMQ для прослуховування (якщо треба, щоб gateway теж слухав)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'gateway_queue', // Черга для gateway
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  
  // Запускаємо HTTP-сервер на порту 3002 (наприклад)
  await app.listen(3002);
}
bootstrap();
