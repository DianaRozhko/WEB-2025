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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const slot_service_1 = require("./slot.service");
const create_slot_dto_1 = require("./dto/create-slot.dto");
const generate_slots_dto_1 = require("./dto/generate-slots.dto");
let SlotController = class SlotController {
    constructor(slotService) {
        this.slotService = slotService;
    }
    async createSlot(createSlotDto) {
        return this.slotService.create(createSlotDto);
    }
    async getSlotsForVenue(venueId) {
        return this.slotService.findByVenue(venueId);
    }
    async updateSlot(data) {
        return this.slotService.update(data.id, data.dto);
    }
    async removeSlot(id) {
        return this.slotService.remove(id);
    }
    async generateSlots(dto) {
        // Просто передаємо управління у сервіс
        return this.slotService.generateSlots(dto);
    }
};
__decorate([
    (0, microservices_1.MessagePattern)('create_slot'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_slot_dto_1.CreateSlotDto]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "createSlot", null);
__decorate([
    (0, microservices_1.MessagePattern)('get_slots_for_venue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "getSlotsForVenue", null);
__decorate([
    (0, microservices_1.MessagePattern)('update_slot'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "updateSlot", null);
__decorate([
    (0, microservices_1.MessagePattern)('remove_slot'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "removeSlot", null);
__decorate([
    (0, microservices_1.MessagePattern)('generate_slots'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_slots_dto_1.GenerateSlotsDto]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "generateSlots", null);
SlotController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [slot_service_1.SlotService])
], SlotController);
exports.SlotController = SlotController;
