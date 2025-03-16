// api-gateway/src/app.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.guard';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Реєстрація нового користувача
  @Post('register')
  register(@Body() createUserDto: any) {
    return this.appService.createUser(createUserDto);
  }

  // Логін користувача
  @Post('login')
  login(@Body() loginUserDto: any) {
    return this.appService.loginUser(loginUserDto);
  }

  // Отримати всіх користувачів (захищений)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.appService.getAllUsers();
  }

  // Отримати користувача за ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.getUserById(id);
  }

  // Оновлення користувача (захищене JWT)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.appService.updateUser(id, updateUserDto);
  }

  // Видалити користувача
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.removeUser(id);
  }
}
