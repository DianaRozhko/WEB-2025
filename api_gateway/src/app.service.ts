// api-gateway/src/app.service.ts
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { mapRpcToHttp } from './utils/rpc-to-http.mapper';


@Injectable()
export class AppService {
  private userClient: ClientProxy;
  private venueClient: ClientProxy;
  private bookingClient: ClientProxy;

  constructor() {
    this.userClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'users_queue',
      },
    });

    this.venueClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'venues_queue',
        queueOptions: { durable: true }, // теж true
      },
    });

    this.bookingClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'bookings_queue',
        queueOptions: { durable: true }, // теж true
      },
    });
  }

    // ========== USERS ==========

    async createUser(dto: any) {
      try {
        console.log('⚡ [user_create] got request', dto);
        return await firstValueFrom(this.userClient.send('user_create', dto));
      } catch (error) {
        console.log("mapRpcToHttp")
        console.log('error in apigateway')
        throw mapRpcToHttp(error);
      }
    }
  
    async loginUser(dto: any) {
      try {
        return await firstValueFrom(this.userClient.send('user_login', dto));
      } catch (error) {
        console.log('mapRpcToHttp')
        mapRpcToHttp(error);
      }
    }
  
    async getAllUsers() {
      try {
        return await firstValueFrom(this.userClient.send('get_all_users', {}));
      } catch (error) {
        mapRpcToHttp(error);
      }
    }
  
    async getUserById(id: string) {
      try {
        return await firstValueFrom(this.userClient.send('user_findOne', id));
      } catch (error) {
        mapRpcToHttp(error);
      }
    }
  
    async updateUser(id: string, dto: any) {
      try {
        return await firstValueFrom(
          this.userClient.send('user_update', { id, dto }),
        );
      } catch (error) {
        mapRpcToHttp(error);
      }
    }
  
    async removeUser(id: string) {
      try {
        return await firstValueFrom(this.userClient.send('user_remove', id));
      } catch (error) {
        mapRpcToHttp(error);
      }
    }
  

  // ====== VENUE SERVICE ВИКЛИКИ ======

  async createVenue(dto: any) {
    try {
      return await firstValueFrom(this.venueClient.send('venue_create', dto));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async getAllVenues() {
    try {
      return await firstValueFrom(this.venueClient.send('venue_findAll', {}));
    } catch (error) {
      
      mapRpcToHttp(error);
    }
  }

  async updateVenue(id: string, dto: any) {
    try {
      return await firstValueFrom(this.venueClient.send('venue_update', { id, dto }));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async removeVenue(id: string) {
    try {
      return await firstValueFrom(this.venueClient.send('venue_remove', id));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async getSlotsForVenue(venueId: string) {
    try {
      return await firstValueFrom(this.venueClient.send('get_slots_for_venue', venueId));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async generateSlotsForVenue(data: any) {
    try {
      return await firstValueFrom(this.venueClient.send('venue_generateSlots', data));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  // ========== SLOTS ==========

  async createSlot(dto: any) {
    try {
      return await firstValueFrom(this.venueClient.send('slot_create', dto));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async getAllSlots() {
    try {
      return await firstValueFrom(this.venueClient.send('slot_findAll', {}));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async getSlotById(id: string) {
    try {
      return await firstValueFrom(this.venueClient.send('slot_findOne', id));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async updateSlot(id: string, dto: any) {
    try {
      return await firstValueFrom(this.venueClient.send('slot_update', { id, ...dto }));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }

  async removeSlot(id: string) {
    try {
      return await firstValueFrom(this.venueClient.send('slot_remove', id));
    } catch (error) {
      mapRpcToHttp(error);
    }
  }




  // Додаємо новий метод:
async createBookingFromSlots(data: { user_id: string; venue_id: string; slot_ids: string[] }) {
  const { user_id, venue_id, slot_ids } = data;

  if (!slot_ids || slot_ids.length < 1) {
    throw new BadRequestException('Не передано жодного слоту');
  }

  // 1) Завантажуємо слоти з VenueService
  // Припустимо, VenueService матиме метод 'slot_findManyByIds', який повертає масив слотів.
  let slots;
  try {
    slots = await firstValueFrom(
      this.venueClient.send('slot_findManyByIds', { slot_ids })
    );
  } catch (error) {
    throw this.mapRpcToHttp(error);
  }

  if (!Array.isArray(slots) || slots.length !== slot_ids.length) {
    // деякі слоти не знайдено
    throw new ConflictException('Деякі слоти не існують або недоступні');
  }

  // 2) Перевіряємо, що всі слоти належать одному майданчику, доступні, і без «пропусків»
  //    Для цього відсортуємо за start_time
  slots.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  for (const slot of slots) {
    if (slot.venue.id !== venue_id) {
      throw new ConflictException('Один зі слотів належить іншому майданчику');
    }
    if (!slot.is_available) {
      throw new ConflictException('Один зі слотів уже зайнято');
    }
  }

  // 3) Перевірка «послідовності»: end_time попереднього == start_time наступного
  for (let i = 0; i < slots.length - 1; i++) {
    const currentEnd = new Date(slots[i].end_time).getTime();
    const nextStart = new Date(slots[i + 1].start_time).getTime();
    if (currentEnd !== nextStart) {
      throw new ConflictException('Слоти не йдуть поспіль без прогалин у часі');
    }
  }

  // 4) minStart — start_time першого слоту, maxEnd — end_time останнього
  const minStart = slots[0].start_time;
  const maxEnd = slots[slots.length - 1].end_time;

  // 5) Викликаємо BookingService -> booking_create
  // Припустимо, bookingClient.send('booking_create', { user_id, venue_id, start_time, end_time })
  try {
    // у твоєму коді bookingService не зареєстрований, тож зареєструй:
    //   this.bookingClient = ClientProxyFactory.create({ ... });
    // або ClientsModule реєстрація
    const createdBooking = await firstValueFrom(this.bookingClient.send('booking_create', {
      user_id,
      venue_id,
      start_time: minStart,
      end_time: maxEnd,
    }));

    // 6) Якщо бронювання створено — оновлюємо is_available для всіх слотів
    // Наприклад, let updateResult = venueClient.send('slot_makeUnavailable', { slot_ids })
    await firstValueFrom(
      this.venueClient.send('slot_makeUnavailable', { slot_ids })
    );

    // 7) Повертаємо createdBooking
    return createdBooking;
  } catch (error) {
    throw this.mapRpcToHttp(error);
  }
}

private mapRpcToHttp(error: any) {
  // твій існуючий метод перетворення RpcException у HTTP
  return mapRpcToHttp(error);
}


async cancelBookingOrchestrated(bookingId: string) {
  try {
    // 1) ДІЗНАЄМОСЯ, яке бронювання скасовувати
    //    Треба отримати booking з BookingService, 
    //    щоб знати venue_id, start_time, end_time
    const booking = await firstValueFrom(
      this.bookingClient.send('booking_findOne', bookingId),
    );

    if (!booking) {
      throw new NotFoundException(`Бронювання з id=${bookingId} не знайдено`);
    }

    // 2) СКАСУВАННЯ В BOOKING SERVICE
    //    Оновлює status -> 'cancelled'
    const cancelledBooking = await firstValueFrom(
      this.bookingClient.send('booking_cancel', bookingId),
    );

    // 3) ЗВІЛЬНЯЄМО СЛОТИ У VENUE SERVICE
    //    Тут передаємо venue_id + часовий інтервал
    //    (booking.start_time, booking.end_time)
    await firstValueFrom(
      this.venueClient.send('slots_makeAvailableInRange', {
        venue_id: booking.venue_id,
        start_time: booking.start_time,
        end_time: booking.end_time,
      }),
    );

    // 4) ПОВЕРТАЄМО РЕЗУЛЬТАТ КЛІЄНТУ
    return cancelledBooking;
  } catch (error) {
    throw mapRpcToHttp(error);
  }
}

async getBookingsForUser(user_id: string) {
  try {
    return await firstValueFrom(
      this.bookingClient.send('booking_getForUser', user_id),
    );
  } catch (error) {
    throw mapRpcToHttp(error);
  }
}

}
