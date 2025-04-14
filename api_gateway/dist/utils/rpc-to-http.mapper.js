"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRpcToHttp = mapRpcToHttp;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
function mapRpcToHttp(error) {
    console.log('[mapRpcToHttp] caught error ->', error);
    console.log(error instanceof microservices_1.RpcException);
    if (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        'statusCode' in error) {
        const { statusCode, message } = error;
        switch (statusCode) {
            case 400:
                throw new common_1.BadRequestException(message);
            case 404:
                throw new common_1.NotFoundException(message);
            case 409:
                throw new common_1.ConflictException(message);
            default:
                throw new common_1.InternalServerErrorException(message);
        }
    }
    throw new common_1.InternalServerErrorException('No RpcException, maybe no microservice call?');
}
//# sourceMappingURL=rpc-to-http.mapper.js.map