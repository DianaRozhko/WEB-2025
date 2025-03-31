import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { GenerateSlotsDto } from './dto/generate-slots.dto';

@Controller()
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @MessagePattern('create_slot')
  async createSlot(createSlotDto: CreateSlotDto) {
    return this.slotService.create(createSlotDto);
  }

  @MessagePattern('get_slots_for_venue')
  async getSlotsForVenue(venueId: string) {
    return this.slotService.findByVenue(venueId);
  }

  @MessagePattern('update_slot')
  async updateSlot(data: { id: string; dto: UpdateSlotDto }) {
    return this.slotService.update(data.id, data.dto);
  }

  @MessagePattern('remove_slot')
  async removeSlot(id: string) {
    return this.slotService.remove(id);
  }


  @MessagePattern('generate_slots')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async generateSlots(dto: GenerateSlotsDto) {
    // Просто передаємо управління у сервіс
    return this.slotService.generateSlots(dto);
  }
}
