import { HttpException, HttpStatus } from '@nestjs/common';

export class NodesNotFoundException extends HttpException {
  constructor() {
    super('Nodes Not Found', HttpStatus.NO_CONTENT);
  }
}
