// booking/dto/create-booking.dto.ts
import { IsUUID, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  venue_id: string;

  @IsDateString()
  start_time: string; 

  @IsDateString()
  end_time: string;   
}
