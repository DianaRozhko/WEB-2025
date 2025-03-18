// api-gateway/src/auth/jwt.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// JwtAuthGuard успадковує базовий AuthGuard, використовуючи стратегію 'jwt'.
// Він перевіряє, чи має запит валідний JWT, і дозволяє доступ до захищених маршрутів.
export class JwtAuthGuard extends AuthGuard('jwt') {}
