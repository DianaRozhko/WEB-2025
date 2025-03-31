import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(['football', 'tennis', 'basketball', 'other'])
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
