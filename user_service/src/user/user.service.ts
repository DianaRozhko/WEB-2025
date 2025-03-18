// user-service/src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
// Сервіс для роботи з користувачами, що включає операції створення, оновлення, отримання і видалення
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Репозиторій, який надає доступ до таблиці "users"
  ) {}

  /**
   * Створення нового користувача.
   * Хешує пароль перед збереженням.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10); // Хешування пароля з використанням bcrypt

    // Створення нового об'єкта користувача на основі даних з DTO
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword, // Зберігаємо хешований пароль
    });

    // Збереження користувача в базі даних
    return this.userRepository.save(user);
  }

  /**
   * Отримання всіх користувачів.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Отримання користувача за ID.
   */
  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Пошук користувача за email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Оновлення даних користувача.
   * Якщо передається новий пароль, він хешується перед збереженням.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Знаходимо існуючого користувача за ID
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    // Якщо оновлюється пароль, хешуємо його
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    // Об'єднуємо існуючі дані з новими та зберігаємо оновленого користувача
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  /**
   * Видалення користувача.
   * Якщо користувач не знайдений, кидає помилку.
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
  }
}
