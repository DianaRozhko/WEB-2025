// booking/booking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepo: Repository<BookingEntity>,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<BookingEntity> {
    // Перевірка слотів уже зроблена на API Gateway, тому просто записуємо:
    const booking = this.bookingRepo.create({
      user_id: dto.user_id,
      venue_id: dto.venue_id,
      start_time: new Date(dto.start_time),
      end_time: new Date(dto.end_time),
      status: 'confirmed', 
    });

    try {
      return await this.bookingRepo.save(booking);
    } catch (err) {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося створити бронювання',
      });
    }
  }


  async getBookingsForUser(userId: string) {
    try {
      return await this.bookingRepo.find({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
      });
    } catch (err) {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося отримати бронювання користувача',
      });
    }
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: 'Бронювання не знайдено',
      });
    }
    booking.status = 'cancelled';
    try {
      return await this.bookingRepo.save(booking);
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося скасувати бронювання',
      });
    }
  }


  // booking.service.ts
async findOne(bookingId: string) {
  const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
  return booking;
}
}
