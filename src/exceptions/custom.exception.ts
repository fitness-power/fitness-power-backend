import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string | string[], statusCode: number) {
    super(message, statusCode);
  }
}
