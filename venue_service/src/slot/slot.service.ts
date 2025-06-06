import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { In } from 'typeorm';
import { Slot } from './slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { GenerateSlotsDto } from './dto/generate-slots.dto';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
  ) {}

  async create(createSlotDto: CreateSlotDto): Promise<Slot> {
    const slot = this.slotRepository.create({
      start_time: new Date(createSlotDto.start_time),
      end_time: new Date(createSlotDto.end_time),
      venue: { id: createSlotDto.venueId } as any,
      is_available: createSlotDto.is_available ?? true,
    });
    try {
      return await this.slotRepository.save(slot);
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося створити слот',
      });
    }
  }
  async findAll(): Promise<Slot[]> {
    try {
      return await this.slotRepository.find({
        order: { start_time: 'ASC' },
      });
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося отримати список слотів',
      });
    }
  }
  async findByVenue(venueId: string): Promise<Slot[]> {
    try {
      return await this.slotRepository.find({
        where: { venue: { id: venueId } },
        order: { start_time: 'ASC' },
      });
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося отримати слоти',
      });
    }
  }

  async update(id: string, updateSlotDto: UpdateSlotDto): Promise<Slot> {
    const slot = await this.slotRepository.findOne({ where: { id } });
    if (!slot) {
      throw new RpcException({
        statusCode: 404,
        message: 'Слот не знайдено',
      });
    }

    if (updateSlotDto.start_time) {
      slot.start_time = new Date(updateSlotDto.start_time);
    }
    if (updateSlotDto.end_time) {
      slot.end_time = new Date(updateSlotDto.end_time);
    }
    if (updateSlotDto.is_available !== undefined) {
      slot.is_available = updateSlotDto.is_available;
    }
    if (updateSlotDto.venueId) {
      slot.venue = { id: updateSlotDto.venueId } as any;
    }

    try {
      return await this.slotRepository.save(slot);
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося оновити слот',
      });
    }
  }

  async remove(id: string) {
    const slot = await this.slotRepository.findOne({ where: { id } });
    if (!slot) {
      throw new RpcException({
        statusCode: 404,
        message: 'Слот не знайдено',
      });
    }

    try {
      await this.slotRepository.remove(slot);
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося видалити слот',
      });
    }
  }

  async generateSlots(dto: GenerateSlotsDto): Promise<Slot[]> {
    const { venueId, period, slotDurationMinutes } = dto;

    const lastSlot = await this.slotRepository.findOne({
      where: { venue: { id: venueId } },
      order: { end_time: 'DESC' },
    });

    let generateStart = new Date();
    generateStart.setHours(0, 0, 0, 0);

    if (lastSlot) {
      generateStart = new Date(lastSlot.end_time);
      generateStart.setDate(generateStart.getDate() + 1);
      generateStart.setHours(0, 0, 0, 0);
    }

    const generateEnd = new Date(generateStart);
    switch (period) {
      case 'day':
        generateEnd.setDate(generateEnd.getDate() + 1);
        break;
      case 'week':
        generateEnd.setDate(generateEnd.getDate() + 7);
        break;
      case 'month':
        generateEnd.setDate(generateEnd.getDate() + 30);
        break;
    }

    const allSlots: Slot[] = [];
    const currentDate = new Date(generateStart);

    while (currentDate < generateEnd) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(8, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(22, 0, 0, 0);

      let slotStart = new Date(dayStart);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart.getTime() + slotDurationMinutes * 60000);
        if (slotEnd > dayEnd) break;

        const slot = this.slotRepository.create({
          venue: { id: venueId } as any,
          start_time: slotStart,
          end_time: slotEnd,
          is_available: true,
        });
        allSlots.push(slot);

        slotStart = slotEnd;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    try {
      return await this.slotRepository.save(allSlots);
    } catch (err) {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося згенерувати слоти',
      });
    }
  }



  // slot.service.ts
async findManyByIds(slotIds: string[]): Promise<Slot[]> {
  // якщо TypeORM 0.3+
  const slots = await this.slotRepository.find({
    where: { id: In(slotIds) },
    relations: ['venue'], // щоб venue.id був підтягнутий
    order: { start_time: 'ASC' }, // необов'язково
  });
  return slots;
}

async makeSlotsUnavailable(slotIds: string[]) {
  // Оновити is_available = false
  await this.slotRepository.update({ id: In(slotIds) }, { is_available: false });
  return { updatedCount: slotIds.length };
}



async makeSlotsAvailableInRange(data: {
  venue_id: string;
  start_time: string | Date;
  end_time: string | Date;
}) {
  const { venue_id, start_time, end_time } = data;

  try {
    // Оновлюємо всі слоти, які починаються >= start_time і закінчуються <= end_time
    await this.slotRepository.update(
      {
        venue: { id: venue_id },
        start_time: MoreThanOrEqual(new Date(start_time)),
        end_time: LessThanOrEqual(new Date(end_time)),
      },
      { is_available: true },
    );
    return { success: true };
  } catch (err) {
    throw new RpcException({
      statusCode: 500,
      message: 'Не вдалося звільнити слоти',
    });
  }
}

}
