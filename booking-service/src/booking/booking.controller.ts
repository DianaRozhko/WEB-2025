import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern('booking_create')
  async create(@Payload() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  @MessagePattern('booking_getForUser')
  async getUserBookings(@Payload() userId: string) {
    return this.bookingService.getBookingsForUser(userId);
  }

  @MessagePattern('booking_cancel')
  async cancel(@Payload() bookingId: string) {
    return this.bookingService.cancelBooking(bookingId);
  }

  @MessagePattern('booking_findOne')
async findOneBooking(id: string) {
  return this.bookingService.findOne(id);
}


}
