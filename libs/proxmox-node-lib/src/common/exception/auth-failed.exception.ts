import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthFailedException extends HttpException {
  constructor() {
    super('Authentication failed', HttpStatus.UNAUTHORIZED);
  }
}
