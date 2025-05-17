// booking/dto/create-booking.dto.ts
import { IsUUID, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  venue_id: string;

  @IsDateString()
  start_time: string; // ISO string (наприклад, 2025-06-01T10:00:00Z)

  @IsDateString()
  end_time: string;   // ISO string
}
