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

  @MessagePattern('create_user')
  async createUser(dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @MessagePattern('update_user')
  async updateUser(data: { id: string; dto: UpdateUserDto }) {
    return this.userService.update(data.id, data.dto);
  }

  @MessagePattern('remove_user')
  async removeUser(id: string) {
    return this.userService.remove(id);
  }

  @MessagePattern('get_all_users')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @MessagePattern('get_user_by_id')
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
