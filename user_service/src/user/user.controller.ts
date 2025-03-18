// user-service/src/user/user.controller.ts

import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
// Контролер, який обробляє мікросервісні повідомлення через RabbitMQ
export class UserController {
  constructor(
    private readonly userService: UserService,    // Інжектований сервіс для роботи з користувачами
    private readonly authService: AuthService,    // Інжектований сервіс для аутентифікації та генерації JWT
  ) {}

  /**
   * Створення нового користувача.
   * Обробляє повідомлення з патерном 'create_user'.
   * @UsePipes застосовує ValidationPipe для перевірки даних за правилами, визначеними в CreateUserDto.
   */
  @MessagePattern('create_user')
  @UsePipes(
    new ValidationPipe({
      transform: true,           // Автоматично перетворює вхідні дані у екземпляр CreateUserDto
      whitelist: true,           // Видаляє невідомі властивості
      forbidNonWhitelisted: true // Кидає помилку, якщо присутні невідомі властивості
    }),
  )
  async createUser(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Оновлення користувача.
   * Обробляє повідомлення з патерном 'update_user'.
   * Очікує об'єкт, що містить id користувача та дані для оновлення (UpdateUserDto).
   */
  @MessagePattern('update_user')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async updateUser(data: { id: string; dto: UpdateUserDto }) {
    return this.userService.update(data.id, data.dto);
  }

  /**
   * Видалення користувача.
   * Обробляє повідомлення з патерном 'remove_user' і видаляє користувача за заданим ID.
   */
  @MessagePattern('remove_user')
  async removeUser(id: string) {
    return this.userService.remove(id);
  }

  /**
   * Отримання списку всіх користувачів.
   * Обробляє повідомлення з патерном 'get_all_users'.
   */
  @MessagePattern('get_all_users')
  async getAllUsers() {
    return this.userService.findAll();
  }

  /**
   * Отримання користувача за ID.
   * Обробляє повідомлення з патерном 'get_user_by_id'.
   */
  @MessagePattern('get_user_by_id')
  async getUserById(id: string) {
    return this.userService.findOne(id);
  }

  /**
   * Логін користувача.
   * Обробляє повідомлення з патерном 'user_login' для аутентифікації.
   * Якщо облікові дані вірні, повертає JWT; інакше кидає помилку.
   */
  @MessagePattern('user_login')
  async loginMicroservice(data: LoginUserDto) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
