// slot/dto/generate-slots.dto.ts
import {
    IsString,
    IsUUID,
    IsIn,
    IsInt,
    Min,
    Max,
  } from 'class-validator';
  
  export class GenerateSlotsDto {
    @IsUUID()
    venueId: string;
  
    /**
     * Параметр 'period' визначає,
     * на скільки днів уперед генерувати слоти:
     *  - "day" (1 день),
     *  - "week" (7 днів),
     *  - "month" (30 днів умовно)
     */
    @IsString()
    @IsIn(['day', 'week', 'month'])
    period: 'day' | 'week' | 'month';
  
    /**
     * Кількість хвилин на кожен слот.
     * Мінімум 30, максимум 120.
     * Наприклад: 30, 60, 90, 120.
     */
    @IsInt()
    @Min(30)
    @Max(120)
    slotDurationMinutes: number;
  }
  