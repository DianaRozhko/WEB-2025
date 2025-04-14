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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const microservices_1 = require("@nestjs/microservices");
const booking_entity_1 = require("./booking.entity");
let BookingService = class BookingService {
    bookingRepo;
    constructor(bookingRepo) {
        this.bookingRepo = bookingRepo;
    }
    async createBooking(dto) {
        const booking = this.bookingRepo.create({
            user_id: dto.user_id,
            venue_id: dto.venue_id,
            start_time: new Date(dto.start_time),
            end_time: new Date(dto.end_time),
            status: 'confirmed',
        });
        try {
            return await this.bookingRepo.save(booking);
        }
        catch (err) {
            throw new microservices_1.RpcException({
                statusCode: 500,
                message: 'Не вдалося створити бронювання',
            });
        }
    }
    async getBookingsForUser(userId) {
        try {
            return await this.bookingRepo.find({
                where: { user_id: userId },
                order: { created_at: 'DESC' },
            });
        }
        catch (err) {
            throw new microservices_1.RpcException({
                statusCode: 500,
                message: 'Не вдалося отримати бронювання користувача',
            });
        }
    }
    async cancelBooking(bookingId) {
        const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
        if (!booking) {
            throw new microservices_1.RpcException({
                statusCode: 404,
                message: 'Бронювання не знайдено',
            });
        }
        booking.status = 'cancelled';
        try {
            return await this.bookingRepo.save(booking);
        }
        catch {
            throw new microservices_1.RpcException({
                statusCode: 500,
                message: 'Не вдалося скасувати бронювання',
            });
        }
    }
    async findOne(bookingId) {
        const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
        return booking;
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.BookingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookingService);
//# sourceMappingURL=booking.service.js.map