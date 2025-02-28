import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const message = exception.getResponse();
    const stack = (exception as any).stack || null;
    if (process.env.NODE_ENV !== 'production') {
      response.status(statusCode).send({
        statusCode,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
        stack,
      });
    } else {
      response.status(statusCode).send({
        statusCode,
        message,
      });
    }
  }
}
