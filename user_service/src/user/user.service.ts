import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password: rawPassword, ...otherProps } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email: otherProps.email },
    });

    if (existingUser) {
      // 409 Conflict
      throw new RpcException({
        statusCode: 409,
        message: 'Email вже зайнято',
      });
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const newUser = this.userRepository.create({
      ...otherProps,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      // 500 Internal Server Error
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося зберегти користувача',
      });
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося отримати користувачів',
      });
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        // 404 Not Found
        throw new RpcException({
          statusCode: 404,
          message: 'Користувача не знайдено',
        });
      }
      return user;
    } catch (error) {
      // Якщо це вже RpcException (наприклад, 404), прокидаємо далі без змін
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Помилка пошуку користувача',
      });
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Помилка при пошуку по email',
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Спершу перевіримо, чи існує
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    try {
      return await this.userRepository.save(user);
    } catch (error: any) {
      // Якщо унікальність email порушена
      if (error.code === '23505' && error.detail?.includes('email')) {
        // 409 Conflict
        throw new RpcException({
          statusCode: 409,
          message: 'Email вже використовується',
        });
      }
      // 500 Internal Server Error
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося оновити користувача',
      });
    }
  }

  async remove(id: string): Promise<string> {
    const user = await this.findOne(id);
    try {
      await this.userRepository.remove(user);
      return 'OK'; // ← Повертаємо бодай щось
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося видалити користувача',
      });
    }
  }
}
