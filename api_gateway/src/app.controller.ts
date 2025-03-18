// api-gateway/src/app.controller.ts

import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.guard';

@Controller('users') // Базовий маршрут для операцій над користувачами
export class AppController {
  constructor(private readonly appService: AppService) {}

  // POST /users/register: Роут для реєстрації користувача
  @Post('register')
  register(@Body() createUserDto: any) {
    return this.appService.createUser(createUserDto);
  }

  // POST /users/login: Роут для логіну користувача
  @Post('login')
  login(@Body() loginUserDto: any) {
    return this.appService.loginUser(loginUserDto);
  }

  // GET /users: Захищений маршрут для отримання списку всіх користувачів
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.appService.getAllUsers();
  }

  // GET /users/:id: Отримання даних користувача за ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.getUserById(id);
  }

  // PATCH /users/:id: Роут для оновлення даних користувача
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.appService.updateUser(id, updateUserDto);
  }

  // DELETE /users/:id: Роут для видалення користувача
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.removeUser(id);
  }
}
