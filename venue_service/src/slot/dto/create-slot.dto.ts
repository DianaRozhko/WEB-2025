
import { IsUUID, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSlotDto {
  @IsUUID()
  venueId: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}
