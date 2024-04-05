import { HttpException, HttpStatus } from '@nestjs/common';

export class VersionNotFoundException extends HttpException {
  constructor() {
    super('Error Obtaining Version', HttpStatus.BAD_REQUEST);
  }
}
