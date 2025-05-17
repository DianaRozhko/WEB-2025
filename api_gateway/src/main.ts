import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'http://localhost:5173',   // auth-ui
    'http://localhost:5174',   // venue-ui
    'http://localhost:5175',   // booking-ui
  ]
  /* 👇  увімкніть CORS одразу після створення app */
  app.enableCors({
    origin: allowedOrigins,      // фронт, з якого йде запит
    credentials: false,                   // токен летить у header, cookie не використовуємо
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'gateway_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
