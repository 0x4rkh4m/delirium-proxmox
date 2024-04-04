import { HttpException, HttpStatus } from '@nestjs/common';

export class HostUnreachableException extends HttpException {
  constructor() {
    super('Host is unreachable', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
