import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  // Створюємо HTTP-застосунок
  const app = await NestFactory.create(AppModule);

  // Підключаємо мікросервіс (RabbitMQ)
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],  
      queue: 'venue_queue',
      queueOptions: { durable: false },
    },
  });

  // Додаємо глобальний ValidationPipe і до HTTP, і до RMQ
  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  app.useGlobalPipes(validationPipe);
  microservice.useGlobalPipes(validationPipe); // ← обов'язково для мікросервісу!

  await app.startAllMicroservices();
  await app.listen(3003);
  console.log('Venue Service is running on port 3003');
}

bootstrap();
