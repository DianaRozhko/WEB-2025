import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from './booking/booking.module';
import { BookingEntity } from './booking/booking.entity';

@Module({
  imports: [
    // Підключення до тієї ж БД, що й інші сутності
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mydb',
      entities: [BookingEntity],
      synchronize: true, // Увімкнено автостворення/оновлення таблиць
    }),
    BookingModule,
  ],
})
export class AppModule {}
