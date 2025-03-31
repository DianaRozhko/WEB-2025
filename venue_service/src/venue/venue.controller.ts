import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Controller()
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  // Створення нового майданчика
  @MessagePattern('create_venue')
  async createVenue(createVenueDto: CreateVenueDto) {
    return this.venueService.create(createVenueDto);
  }

  // Отримання списку всіх майданчиків
  @MessagePattern('get_all_venues')
  async getAllVenues() {
    return this.venueService.findAll();
  }

  // Оновлення майданчика
  @MessagePattern('update_venue')
  async updateVenue(data: { id: string; dto: UpdateVenueDto }) {
    return this.venueService.update(data.id, data.dto);
  }

  // Видалення майданчика
  @MessagePattern('remove_venue')
  async removeVenue(id: string) {
    return this.venueService.remove(id);
  }
}
