import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Slot])],
  providers: [SlotService],
  controllers: [SlotController],
})
export class SlotModule {}
