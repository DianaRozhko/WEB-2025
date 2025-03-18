// user-service/src/user/dto/create-user.dto.ts

import { IsString, IsEmail, MinLength } from 'class-validator';

/**
 * DTO для створення нового користувача.
 * - name: має бути рядком з мінімальною довжиною 1 символ.
 * - email: має бути валідною email-адресою.
 * - password: має бути рядком з мінімальною довжиною 6 символів.
 */
export class CreateUserDto {
  @IsString()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
