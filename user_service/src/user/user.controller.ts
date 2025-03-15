// user-service/src/user/user.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // Створення нового користувача
  @MessagePattern('create_user')
  async createUser(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Видалення користувача
  @MessagePattern('remove_user')
  async removeUser(id: string) {
    try {
      await this.userService.remove(id);
      return { success: true, message: 'User removed' };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // **НОВЕ**: Оновлення користувача
  @MessagePattern('update_user')
  async updateUser(data: { id: string; dto: UpdateUserDto }) {
    const { id, dto } = data;
    try {
      const updated = await this.userService.update(id, dto);
      return updated;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Отримати усіх користувачів
  @MessagePattern('get_all_users')
  async getAllUsers() {
    return this.userService.findAll();
  }

  // Отримати користувача за ID
  @MessagePattern('get_user_by_id')
  async getUserById(id: string) {
    return this.userService.findOne(id);
  }

  // Логін (аутентифікація + JWT)
  @MessagePattern('user_login')
  async loginMicroservice(data: LoginUserDto) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
