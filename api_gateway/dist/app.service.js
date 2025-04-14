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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const rpc_to_http_mapper_1 = require("./utils/rpc-to-http.mapper");
let AppService = class AppService {
    userClient;
    venueClient;
    bookingClient;
    constructor() {
        this.userClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: ['amqp://rabbitmq:5672'],
                queue: 'users_queue',
            },
        });
        this.venueClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: ['amqp://rabbitmq:5672'],
                queue: 'venues_queue',
                queueOptions: { durable: true },
            },
        });
    }
    async createUser(dto) {
        try {
            console.log('⚡ [user_create] got request', dto);
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('user_create', dto));
        }
        catch (error) {
            console.log("mapRpcToHttp");
            console.log('error in apigateway');
            throw (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async loginUser(dto) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('user_login', dto));
        }
        catch (error) {
            console.log('mapRpcToHttp');
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async getAllUsers() {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('get_all_users', {}));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async getUserById(id) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('user_findOne', id));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async updateUser(id, dto) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('user_update', { id, dto }));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async removeUser(id) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.userClient.send('user_remove', id));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async createVenue(dto) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('venue_create', dto));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async getAllVenues() {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('venue_findAll', {}));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async updateVenue(id, dto) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('venue_update', { id, dto }));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async removeVenue(id) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('venue_remove', id));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async getSlotsForVenue(venueId) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('get_slots_for_venue', venueId));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async generateSlotsForVenue(data) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('venue_generateSlots', data));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async createSlot(dto) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slot_create', dto));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async getAllSlots() {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slot_findAll', {}));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async getSlotById(id) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slot_findOne', id));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async updateSlot(id, dto) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slot_update', { id, ...dto }));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async removeSlot(id) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slot_remove', id));
        }
        catch (error) {
            (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
    async createBookingFromSlots(data) {
        const { user_id, venue_id, slot_ids } = data;
        if (!slot_ids || slot_ids.length < 1) {
            throw new common_1.BadRequestException('Не передано жодного слоту');
        }
        let slots;
        try {
            slots = await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slot_findManyByIds', { slot_ids }));
        }
        catch (error) {
            throw this.mapRpcToHttp(error);
        }
        if (!Array.isArray(slots) || slots.length !== slot_ids.length) {
            throw new common_1.ConflictException('Деякі слоти не існують або недоступні');
        }
        slots.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        for (const slot of slots) {
            if (slot.venue.id !== venue_id) {
                throw new common_1.ConflictException('Один зі слотів належить іншому майданчику');
            }
            if (!slot.is_available) {
                throw new common_1.ConflictException('Один зі слотів уже зайнято');
            }
        }
        for (let i = 0; i < slots.length - 1; i++) {
            const currentEnd = new Date(slots[i].end_time).getTime();
            const nextStart = new Date(slots[i + 1].start_time).getTime();
            if (currentEnd !== nextStart) {
                throw new common_1.ConflictException('Слоти не йдуть поспіль без прогалин у часі');
            }
        }
        const minStart = slots[0].start_time;
        const maxEnd = slots[slots.length - 1].end_time;
        try {
            const createdBooking = await (0, rxjs_1.firstValueFrom)(this.bookingClient.send('booking_create', {
                user_id,
                venue_id,
                start_time: minStart,
                end_time: maxEnd,
            }));
            await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slot_makeUnavailable', { slot_ids }));
            return createdBooking;
        }
        catch (error) {
            throw this.mapRpcToHttp(error);
        }
    }
    mapRpcToHttp(error) {
        return (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
    }
    async cancelBookingOrchestrated(bookingId) {
        try {
            const booking = await (0, rxjs_1.firstValueFrom)(this.bookingClient.send('booking_findOne', bookingId));
            if (!booking) {
                throw new common_1.NotFoundException(`Бронювання з id=${bookingId} не знайдено`);
            }
            const cancelledBooking = await (0, rxjs_1.firstValueFrom)(this.bookingClient.send('booking_cancel', bookingId));
            await (0, rxjs_1.firstValueFrom)(this.venueClient.send('slots_makeAvailableInRange', {
                venue_id: booking.venue_id,
                start_time: booking.start_time,
                end_time: booking.end_time,
            }));
            return cancelledBooking;
        }
        catch (error) {
            throw (0, rpc_to_http_mapper_1.mapRpcToHttp)(error);
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map