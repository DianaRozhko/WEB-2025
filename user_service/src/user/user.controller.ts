//user-service/src/user.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('user_create')
  async createUser(dto: CreateUserDto) {
    console.log("user_create controller")
    return this.userService.create(dto);
  }

  @MessagePattern('user_update')
  async updateUser(data: { id: string; dto: UpdateUserDto }) {
    return this.userService.update(data.id, data.dto);
  }

  @MessagePattern('user_remove')
  async removeUser(id: string) {
    return this.userService.remove(id);
  }

  @MessagePattern('get_all_users')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @MessagePattern('user_findOne')
  async getUserById(id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern('user_login')
  async loginMicroservice(data: LoginUserDto) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
