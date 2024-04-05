import { HttpException, HttpStatus } from '@nestjs/common';

export class StoragesNotFoundException extends HttpException {
  constructor() {
    super('Storages Not Found', HttpStatus.NO_CONTENT);
  }
}
