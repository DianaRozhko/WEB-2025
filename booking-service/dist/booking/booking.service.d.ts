import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './booking.entity';
export declare class BookingService {
    private bookingRepo;
    constructor(bookingRepo: Repository<BookingEntity>);
    createBooking(dto: CreateBookingDto): Promise<BookingEntity>;
    getBookingsForUser(userId: string): Promise<BookingEntity[]>;
    cancelBooking(bookingId: string): Promise<BookingEntity>;
    findOne(bookingId: string): Promise<BookingEntity | null>;
}
