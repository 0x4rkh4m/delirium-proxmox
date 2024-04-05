import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateVMException extends HttpException {
  constructor() {
    super('Error creating VM', HttpStatus.BAD_REQUEST);
  }
}
