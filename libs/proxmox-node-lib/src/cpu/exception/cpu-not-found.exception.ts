import { HttpException, HttpStatus } from '@nestjs/common';

export class CpusNotFoundException extends HttpException {
  constructor() {
    super('Cpus Not Found', HttpStatus.NO_CONTENT);
  }
}
