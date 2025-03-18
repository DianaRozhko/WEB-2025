// user-service/src/app.module.ts

import { Module } from '@nestjs/common';
// TypeOrmModule використовується для підключення до бази даних
import { TypeOrmModule } from '@nestjs/typeorm';
// ClientsModule дозволяє реєструвати клієнтів для мікросервісної взаємодії (через RabbitMQ)
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from './user/user.module';
// Імпортуємо сутність User для роботи з БД
import { User } from './user/user.entity';

@Module({
  imports: [
    // Налаштовуємо підключення до Postgres за допомогою TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',       // хост бази даних
      port: 5432,              // порт для підключення
      username: 'postgres',    // ім'я користувача
      password: 'postgres',    // пароль
      database: 'mydb',        // назва бази даних
      entities: [User],        // всі сутності, які використовуються в цьому сервісі
      synchronize: true,       // Автоматичне створення/оновлення таблиць (тільки для dev-середовища!)
    }),

    // Дозволяємо репозиторіям працювати з сутністю User у модулі UserModule
    TypeOrmModule.forFeature([User]),
    // Імпортуємо UserModule, який містить контролери та сервіси для користувачів
    UserModule,

    // Реєструємо клієнта для взаємодії з API Gateway (опційно, якщо потрібно надсилати повідомлення з user-service до gateway)
    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          // Черга, яка слухається gateway
          queue: 'gateway_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  // Контролери та провайдери, які можна використовувати глобально (якщо потрібно)
  controllers: [],
  providers: [],
})
export class AppModule {}
