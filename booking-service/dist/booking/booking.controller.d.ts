import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(dto: CreateBookingDto): Promise<import("./booking.entity").BookingEntity>;
    getUserBookings(userId: string): Promise<import("./booking.entity").BookingEntity[]>;
    cancel(bookingId: string): Promise<import("./booking.entity").BookingEntity>;
    findOneBooking(id: string): Promise<import("./booking.entity").BookingEntity | null>;
}
