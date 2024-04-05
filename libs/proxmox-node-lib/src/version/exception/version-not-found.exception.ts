import { HttpException, HttpStatus } from '@nestjs/common';

export class VersionNotFoundException extends HttpException {
  constructor() {
    super('Version Not Found', HttpStatus.NO_CONTENT);
  }
}
