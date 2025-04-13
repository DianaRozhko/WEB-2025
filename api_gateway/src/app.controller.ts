// api-gateway/app.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { AdminGuard } from './auth/admin.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ----------- USERS -----------
  @Post('users/register')
  register(@Body() createUserDto: any) {
    return this.appService.createUser(createUserDto);
  }

  @Post('users/login')
  login(@Body() loginUserDto: any) {
    return this.appService.loginUser(loginUserDto);
  }

  // Захищений ендпоінт для отримання всіх користувачів
  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAllUsers() {
    return this.appService.getAllUsers();
  }

  
  @Get('users/:id')
  findOneUser(@Param('id') id: string) {
    return this.appService.getUserById(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.appService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  removeUser(@Param('id') id: string) {
    return this.appService.removeUser(id);
  }

  // ----------- VENUES -----------
  // Створення нового майданчика (POST /venues)
  @Post('venues')
  createVenue(@Body() createVenueDto: any) {
    return this.appService.createVenue(createVenueDto);
  }

  // Отримання списку всіх майданчиків (GET /venues)
  @Get('venues')
  getAllVenues() {
    return this.appService.getAllVenues();
  }

  // Оновлення майданчика (PATCH /venues/:id)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('venues/:id')
  updateVenue(@Param('id') id: string, @Body() updateVenueDto: any) {
    return this.appService.updateVenue(id, updateVenueDto);
  }

  // Видалення майданчика (DELETE /venues/:id)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('venues/:id')
  removeVenue(@Param('id') id: string) {
    return this.appService.removeVenue(id);
  }

  // Отримання слотів для майданчика (GET /venues/:id/slots)
  @Get('venues/:id/slots')
  getSlotsForVenue(@Param('id') venueId: string) {
    return this.appService.getSlotsForVenue(venueId);
  }

  // app.controller.ts
@UseGuards(JwtAuthGuard, AdminGuard)
@Post('venues/:id/generate-slots')
generateSlots(
  @Param('id') venueId: string,
  @Body() generateDto: any,
) {
  // Переконаємося, що venueId йде в dto. 
  return this.appService.generateSlotsForVenue({
    ...generateDto,
    venueId,
  });
}

// ----------- SLOTS ----------- //

// Створення слота (доступно тільки адміну)
@UseGuards(JwtAuthGuard, AdminGuard)
@Post('slots')
createSlot(@Body() createSlotDto: any) {
  return this.appService.createSlot(createSlotDto);
}

// Отримання всіх слотів
@Get('slots')
getAllSlots() {
  return this.appService.getAllSlots();
}

// Отримання одного слота
@Get('slots/:id')
getSlotById(@Param('id') id: string) {
  return this.appService.getSlotById(id);
}

// Оновлення слота (доступно тільки адміну)
@UseGuards(JwtAuthGuard, AdminGuard)
@Patch('slots/:id')
updateSlot(@Param('id') id: string, @Body() updateSlotDto: any) {
  return this.appService.updateSlot(id, updateSlotDto);
}

// Видалення слота (доступно тільки адміну)
@UseGuards(JwtAuthGuard, AdminGuard)
@Delete('slots/:id')
removeSlot(@Param('id') id: string) {
  return this.appService.removeSlot(id);
}

}
