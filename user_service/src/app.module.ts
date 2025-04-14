// user-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Читаємо змінні з .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Підключення до бази даних
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'mydb',
      // autoLoadEntities: true — можна, якщо багато сутностей у різних модулях
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Якщо треба RMQ-клієнт до Gateway
    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'gateway_queue',
          queueOptions: { durable: false },
        },
      },
    ]),

    // Головний модуль користувачів
    UserModule,
  ],
})
export class AppModule {}
