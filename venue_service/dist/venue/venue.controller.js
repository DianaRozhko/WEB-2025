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
exports.VenueController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const venue_service_1 = require("./venue.service");
const create_venue_dto_1 = require("./dto/create-venue.dto");
let VenueController = class VenueController {
    constructor(venueService) {
        this.venueService = venueService;
    }
    // Створення нового майданчика
    async createVenue(createVenueDto) {
        return this.venueService.create(createVenueDto);
    }
    // Отримання списку всіх майданчиків
    async getAllVenues() {
        return this.venueService.findAll();
    }
    // Оновлення майданчика
    async updateVenue(data) {
        return this.venueService.update(data.id, data.dto);
    }
    // Видалення майданчика
    async removeVenue(id) {
        return this.venueService.remove(id);
    }
};
__decorate([
    (0, microservices_1.MessagePattern)('create_venue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venue_dto_1.CreateVenueDto]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "createVenue", null);
__decorate([
    (0, microservices_1.MessagePattern)('get_all_venues'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "getAllVenues", null);
__decorate([
    (0, microservices_1.MessagePattern)('update_venue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "updateVenue", null);
__decorate([
    (0, microservices_1.MessagePattern)('remove_venue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VenueController.prototype, "removeVenue", null);
VenueController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [venue_service_1.VenueService])
], VenueController);
exports.VenueController = VenueController;
