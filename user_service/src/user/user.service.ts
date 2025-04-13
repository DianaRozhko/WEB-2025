// Повна обробка: створення, оновлення, видалення, перевірка email
// Обробляє 404, 409, 500

import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
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
      console.log("Email вже використовується")
      throw new ConflictException('Email вже зайнято');
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const newUser = this.userRepository.create({
      ...otherProps,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Не вдалося зберегти користувача');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch {
      throw new InternalServerErrorException('Не вдалося отримати користувачів');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('Користувача не знайдено');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Помилка пошуку користувача');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch {
      throw new InternalServerErrorException('Помилка при пошуку по email');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const rawPassword = updateUserDto.password;
      updateUserDto.password = await bcrypt.hash(rawPassword, 10);
    }

    Object.assign(user, updateUserDto);

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505' && error.detail?.includes('email')) {
       
        throw new ConflictException('Email вже використовується');
      }
      throw new InternalServerErrorException('Не вдалося оновити користувача');
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    try {
      await this.userRepository.remove(user);
    } catch {
      throw new InternalServerErrorException('Не вдалося видалити користувача');
    }
  }
}
