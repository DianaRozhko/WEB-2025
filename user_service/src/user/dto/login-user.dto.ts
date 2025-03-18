// user-service/src/user/dto/login-user.dto.ts

import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO для логіну користувача.
 * Забезпечує перевірку email (формат) та password (мінімальна довжина).
 */
export class LoginUserDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
