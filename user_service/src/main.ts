import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe} from '@nestjs/common';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';


async function bootstrap() {
  // Створюємо мікросервіс NestJS (RMQ)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'users_queue',
        queueOptions: { durable: true },
      },
    },
  );

  // Підключаємо фільтр для перетворення HttpException -> RpcException
  //app.useGlobalFilters(new AllExceptionsToRpcFilter());

  // Глобальний ValidationPipe: DTO-валидація
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        // Формуємо повідомлення
        const messages = errors.map(
          (err) => `${err.property} - ${Object.values(err.constraints || {}).join(', ')}`,
        );
        // ОДРАЗУ КИДАЄМО RpcException, без жодних HttpException
        return  new RpcException({
          statusCode: 400,
          message: messages,
        });
      },
    }),
  );
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  // Safety net: некеровані помилки
  process.on('uncaughtException', (err) => {
    console.error('[Uncaught Exception]', err);
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[Unhandled Rejection]', promise, 'reason:', reason);
  });

  await app.listen();
}
bootstrap();
