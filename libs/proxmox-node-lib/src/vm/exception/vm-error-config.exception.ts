import { HttpException, HttpStatus } from '@nestjs/common';

export class ConfigVMException extends HttpException {
  constructor() {
    super('Error configuring VM', HttpStatus.BAD_REQUEST);
  }
}
