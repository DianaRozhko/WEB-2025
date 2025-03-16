// api-gateway/src/app.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  // Створення (реєстрація) користувача
  async createUser(createUserDto: any) {
    return firstValueFrom(this.client.send('create_user', createUserDto));
  }

  // Логін
  async loginUser(loginUserDto: any) {
    return firstValueFrom(this.client.send('user_login', loginUserDto));
  }

  // Отримати всіх
  async getAllUsers() {
    return firstValueFrom(this.client.send('get_all_users', {}));
  }

  // Отримати одного
  async getUserById(id: string) {
    return firstValueFrom(this.client.send('get_user_by_id', id));
  }

  // Видалення
  async removeUser(id: string) {
    return firstValueFrom(this.client.send('remove_user', id));
  }

  // **НОВЕ**: Оновлення користувача
  async updateUser(id: string, updateUserDto: any) {
    // Надсилаємо патерн 'update_user' з об’єктом { id, dto: ... }
    return firstValueFrom(
      this.client.send('update_user', { id, dto: updateUserDto }),
    );
  }
}
