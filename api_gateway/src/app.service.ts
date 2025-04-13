import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('VENUE_SERVICE') private venueClient: ClientProxy, // Додаємо Venue Client
  ) {}

  // ====== USER SERVICE ВИКЛИКИ (без змін) ======
  async createUser(createUserDto: any) {
    console.log('Gateway: sending create_user with:', createUserDto);
    return firstValueFrom(this.userClient.send('create_user', createUserDto));
  }
  async loginUser(loginUserDto: any) {
    return firstValueFrom(this.userClient.send('user_login', loginUserDto));
  }
  async getAllUsers() {
    return firstValueFrom(this.userClient.send('get_all_users', {}));
  }
  async getUserById(id: string) {
    return firstValueFrom(this.userClient.send('get_user_by_id', id));
  }
  async removeUser(id: string) {
    return firstValueFrom(this.userClient.send('remove_user', id));
  }
  async updateUser(id: string, updateUserDto: any) {
    return firstValueFrom(
      this.userClient.send('update_user', { id, dto: updateUserDto }),
    );
  }

  // ====== VENUE SERVICE ВИКЛИКИ ======
  async createVenue(createVenueDto: any) {
    return firstValueFrom(
      this.venueClient.send('create_venue', createVenueDto),
    );
  }

  async getAllVenues() {
    return firstValueFrom(this.venueClient.send('get_all_venues', {}));
  }

  async updateVenue(id: string, updateVenueDto: any) {
    return firstValueFrom(
      this.venueClient.send('update_venue', { id, dto: updateVenueDto }),
    );
  }

  async removeVenue(id: string) {
    return firstValueFrom(this.venueClient.send('remove_venue', id));
  }

  async getSlotsForVenue(venueId: string) {
    return firstValueFrom(
      this.venueClient.send('get_slots_for_venue', venueId),
    );
  }


//====== Slots  ВИКЛИКИ ======
// Створити слот
async createSlot(dto: any) {
  return firstValueFrom(this.venueClient.send('create_slot', dto));
}

// Отримати всі слоти
async getAllSlots() {
  return firstValueFrom(this.venueClient.send('get_all_slots', {}));
}

// Отримати слот за ID
async getSlotById(id: string) {
  return firstValueFrom(this.venueClient.send('get_slot_by_id', id));
}

// Оновити слот
async updateSlot(id: string, dto: any) {
  return firstValueFrom(this.venueClient.send('update_slot', { id, dto }));
}

// Видалити слот
async removeSlot(id: string) {
  return firstValueFrom(this.venueClient.send('remove_slot', id));
}





  async generateSlotsForVenue(dto: any) {
    return firstValueFrom(
      this.venueClient.send('generate_slots', dto),
    );
  }
}
