import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      throw new InternalServerErrorException('Не вдалося створити слот');
    }
  }

  async findByVenue(venueId: string): Promise<Slot[]> {
    try {
      return await this.slotRepository.find({
        where: { venue: { id: venueId } },
        order: { start_time: 'ASC' },
      });
    } catch {
      throw new InternalServerErrorException('Не вдалося отримати слоти');
    }
  }

  async update(id: string, updateSlotDto: UpdateSlotDto): Promise<Slot> {
    const slot = await this.slotRepository.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('Слот не знайдено');

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
      throw new InternalServerErrorException('Не вдалося оновити слот');
    }
  }

  async remove(id: string) {
    const slot = await this.slotRepository.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('Слот не знайдено');
    try {
      await this.slotRepository.remove(slot);
    } catch {
      throw new InternalServerErrorException('Не вдалося видалити слот');
    }
  }




  async generateSlots(dto: GenerateSlotsDto): Promise<Slot[]> {
    const { venueId, period, slotDurationMinutes } = dto;

    // 1) Шукаємо "останній" слот для venue, сортуємо за end_time.
    const lastSlot = await this.slotRepository.findOne({
      where: { venue: { id: venueId } },
      order: { end_time: 'DESC' },
    });

    // 2) Визначимо, з якої дати починати
    let generateStart = new Date();
    generateStart.setHours(0, 0, 0, 0); // Почнемо з початку дня
    
    if (lastSlot) {
      // Можна почати з "наступного" дня після end_time
      generateStart = new Date(lastSlot.end_time);
      // Наприклад, додаємо 1 день, щоб не дублювати.
      generateStart.setDate(generateStart.getDate() + 1);
      generateStart.setHours(0, 0, 0, 0);
    }

    // 3) Кінець діапазону в залежності від period
    const generateEnd = new Date(generateStart);
    switch (period) {
      case 'day':
        generateEnd.setDate(generateEnd.getDate() + 1);
        break;
      case 'week':
        generateEnd.setDate(generateEnd.getDate() + 7);
        break;
      case 'month':
        // умовно +30 днів
        generateEnd.setDate(generateEnd.getDate() + 30);
        break;
    }

    // 4) Генеруємо слоти по кожному дню від generateStart до generateEnd
    const allSlots: Slot[] = [];

    // "currentDate" — ітерується по днях
    const currentDate = new Date(generateStart);
    while (currentDate < generateEnd) {
      // приклад робочого часу: 08:00–22:00
      const dayStart = new Date(currentDate);
      dayStart.setHours(8, 0, 0, 0); // 8:00

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(22, 0, 0, 0); // 22:00

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

        // Переходимо до наступного інтервалу
        slotStart = slotEnd;
      }

      // Переводимо currentDate на наступний день
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 5) Зберігаємо масовим викликом save()
    try {
      return await this.slotRepository.save(allSlots);
    } catch (err) {
      throw new InternalServerErrorException('Не вдалося згенерувати слоти');
    }
  }


}
