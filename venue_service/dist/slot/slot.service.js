"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const slot_entity_1 = require("./slot.entity");
let SlotService = class SlotService {
    constructor(slotRepository) {
        this.slotRepository = slotRepository;
    }
    async create(createSlotDto) {
        const slot = this.slotRepository.create({
            start_time: new Date(createSlotDto.start_time),
            end_time: new Date(createSlotDto.end_time),
            venue: { id: createSlotDto.venueId },
            is_available: createSlotDto.is_available ?? true,
        });
        try {
            return await this.slotRepository.save(slot);
        }
        catch {
            throw new common_1.InternalServerErrorException('Не вдалося створити слот');
        }
    }
    async findByVenue(venueId) {
        try {
            return await this.slotRepository.find({
                where: { venue: { id: venueId } },
                order: { start_time: 'ASC' },
            });
        }
        catch {
            throw new common_1.InternalServerErrorException('Не вдалося отримати слоти');
        }
    }
    async update(id, updateSlotDto) {
        const slot = await this.slotRepository.findOne({ where: { id } });
        if (!slot)
            throw new common_1.NotFoundException('Слот не знайдено');
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
            slot.venue = { id: updateSlotDto.venueId };
        }
        try {
            return await this.slotRepository.save(slot);
        }
        catch {
            throw new common_1.InternalServerErrorException('Не вдалося оновити слот');
        }
    }
    async remove(id) {
        const slot = await this.slotRepository.findOne({ where: { id } });
        if (!slot)
            throw new common_1.NotFoundException('Слот не знайдено');
        await this.slotRepository.remove(slot);
    }
    async generateSlots(dto) {
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
        const allSlots = [];
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
                if (slotEnd > dayEnd)
                    break;
                const slot = this.slotRepository.create({
                    venue: { id: venueId },
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
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Не вдалося згенерувати слоти');
        }
    }
};
SlotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(slot_entity_1.Slot)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SlotService);
exports.SlotService = SlotService;
