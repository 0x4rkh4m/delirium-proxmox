import { HttpException, HttpStatus } from '@nestjs/common';

export class ResizeVMDiskException extends HttpException {
  constructor() {
    super('Error resizing VM disk', HttpStatus.BAD_REQUEST);
  }
}
