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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let AppService = class AppService {
    userClient;
    venueClient;
    constructor(userClient, venueClient) {
        this.userClient = userClient;
        this.venueClient = venueClient;
    }
    async createUser(createUserDto) {
        console.log('Gateway: sending create_user with:', createUserDto);
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('create_user', createUserDto));
    }
    async loginUser(loginUserDto) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('user_login', loginUserDto));
    }
    async getAllUsers() {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('get_all_users', {}));
    }
    async getUserById(id) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('get_user_by_id', id));
    }
    async removeUser(id) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('remove_user', id));
    }
    async updateUser(id, updateUserDto) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('update_user', { id, dto: updateUserDto }));
    }
    async createVenue(createVenueDto) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('create_venue', createVenueDto));
    }
    async getAllVenues() {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('get_all_venues', {}));
    }
    async updateVenue(id, updateVenueDto) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('update_venue', { id, dto: updateVenueDto }));
    }
    async removeVenue(id) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('remove_venue', id));
    }
    async getSlotsForVenue(venueId) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('get_slots_for_venue', venueId));
    }
    async createSlot(dto) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('create_slot', dto));
    }
    async getAllSlots() {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('get_all_slots', {}));
    }
    async getSlotById(id) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('get_slot_by_id', id));
    }
    async updateSlot(id, dto) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('update_slot', { id, dto }));
    }
    async removeSlot(id) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('remove_slot', id));
    }
    async generateSlotsForVenue(dto) {
        return (0, rxjs_1.firstValueFrom)(this.venueClient.send('generate_slots', dto));
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __param(1, (0, common_1.Inject)('VENUE_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], AppService);
//# sourceMappingURL=app.service.js.map