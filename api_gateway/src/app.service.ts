// api-gateway/src/app.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  // Інжектуємо ClientProxy для взаємодії з USER_SERVICE через RabbitMQ
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  // Метод для реєстрації користувача, який надсилає повідомлення з патерном 'create_user'
  async createUser(createUserDto: any) {
    return firstValueFrom(this.client.send('create_user', createUserDto));
  }

  // Метод для логіну користувача, який надсилає повідомлення з патерном 'user_login'
  async loginUser(loginUserDto: any) {
    return firstValueFrom(this.client.send('user_login', loginUserDto));
  }

  // Метод для отримання списку всіх користувачів, який надсилає повідомлення 'get_all_users'
  async getAllUsers() {
    return firstValueFrom(this.client.send('get_all_users', {}));
  }

  // Метод для отримання користувача за ID, який надсилає повідомлення 'get_user_by_id'
  async getUserById(id: string) {
    return firstValueFrom(this.client.send('get_user_by_id', id));
  }

  // Метод для видалення користувача, який надсилає повідомлення 'remove_user'
  async removeUser(id: string) {
    return firstValueFrom(this.client.send('remove_user', id));
  }

  // Метод для оновлення користувача, який надсилає повідомлення 'update_user'
  async updateUser(id: string, updateUserDto: any) {
    // Передаємо об'єкт, що містить id користувача та дані для оновлення (dto)
    return firstValueFrom(this.client.send('update_user', { id, dto: updateUserDto }));
  }
}
