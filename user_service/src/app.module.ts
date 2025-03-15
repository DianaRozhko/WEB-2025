// user-service/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    // Підключення до Postgres (приклад з localhost)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mydb',
      entities: [User],
      synchronize: true, // Увімкнено автостворення/оновлення таблиць
    }),

    // Даємо змогу репозиторіям працювати з сутністю User
    TypeOrmModule.forFeature([User]),

    // Основний модуль, де налаштована авторизація
    UserModule,

    // (Необов'язково) Якщо треба підключати інші мікросервіси, робіть це тут
    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'gateway_queue', // Черга, що слухає gateway
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
