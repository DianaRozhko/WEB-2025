import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VenueModule } from './venue/venue.module';
import { SlotModule } from './slot/slot.module';

@Module({
  imports: [
    // Дозволяє зчитувати .env
    ConfigModule.forRoot(),
    // Підключення до Postgres
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'mydb',
      autoLoadEntities: true,
      synchronize: true, // Лише для dev
    }),
    // Наші модулі
    VenueModule,
    SlotModule,
    // Приклад підключення клієнта (не обов'язково)
    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: 'gateway_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
})
export class AppModule {}
