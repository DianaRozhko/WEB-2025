import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { RpcException } from '@nestjs/microservices';
  
  @Catch()
  export class AllExceptionsToRpcFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsToRpcFilter.name);
  
    catch(exception: any, host: ArgumentsHost) {
      const isRpc = host.getType() === 'rpc';
      this.logger.warn(`[ExceptionFilter] Host type: ${host.getType()}`);
      this.logger.warn('[ExceptionFilter] Caught Exception:', exception);
  
      // ✅ Якщо вже RpcException – повторно не обробляємо
      if (exception instanceof RpcException) {
        this.logger.warn('🟡 RpcException – передаю далі без змін');
        throw exception;
      }
  
      if (isRpc) {
        if (exception instanceof HttpException) {
          const response = exception.getResponse();
          const status = exception.getStatus();
  
          this.logger.warn(
            `⚠️ RPC HttpException: ${status} - ${JSON.stringify(response)}`,
          );
  
          throw new RpcException({
            statusCode: status,
            message:
              typeof response === 'string'
                ? response
                : response['message'] || 'Unknown error',
          });
        }
  
        this.logger.error(`🔥 RPC InternalException: ${exception.message}`);
  
        throw new RpcException({
          statusCode: 500,
          message: exception.message || 'Internal server error',
        });
      }
  
      // не RPC → кидати далі без змін
      throw exception;
    }
  }
  