import { HttpException, HttpStatus } from '@nestjs/common';

export class NetworksNotFoundException extends HttpException {
  constructor() {
    super('Networks Not Found', HttpStatus.NO_CONTENT);
  }
}
