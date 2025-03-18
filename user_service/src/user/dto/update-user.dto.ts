// user-service/src/user/dto/update-user.dto.ts

import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

/**
 * DTO для оновлення даних користувача.
 * Усі поля є опційними, що дозволяє оновлювати лише необхідні дані.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
