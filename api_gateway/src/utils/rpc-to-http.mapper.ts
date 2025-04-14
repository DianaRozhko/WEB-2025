import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { RpcException } from '@nestjs/microservices';
  
  export function mapRpcToHttp(error: any): never {
    console.log('[mapRpcToHttp] caught error ->', error);
     console.log(error instanceof RpcException)

     //////////////////////
     if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        'statusCode' in error
      ) {
        const { statusCode, message } = error as { statusCode: number; message: string };
        switch (statusCode) {
          case 400:
            throw new BadRequestException(message);
          case 404:
            throw new NotFoundException(message);
          case 409:
            throw new ConflictException(message);
          default:
            throw new InternalServerErrorException(message);
        }
      }
  
    throw new InternalServerErrorException('No RpcException, maybe no microservice call?');
  }
  