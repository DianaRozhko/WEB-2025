"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const microservices_1 = require("@nestjs/microservices");
const venue_module_1 = require("./venue/venue.module");
const slot_module_1 = require("./slot/slot.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Дозволяє зчитувати .env
            config_1.ConfigModule.forRoot(),
            // Підключення до Postgres
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'mydb',
                autoLoadEntities: true,
                synchronize: true, // Лише для dev
            }),
            // Наші модулі
            venue_module_1.VenueModule,
            slot_module_1.SlotModule,
            // Приклад підключення клієнта (не обов'язково)
            microservices_1.ClientsModule.register([
                {
                    name: 'GATEWAY_SERVICE',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                        queue: 'gateway_queue',
                        queueOptions: { durable: false },
                    },
                },
            ]),
        ],
    })
], AppModule);
exports.AppModule = AppModule;
