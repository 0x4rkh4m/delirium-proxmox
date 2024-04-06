import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { DeliriumClient } from '../../delirium-client';

@Injectable()
export class ProxmoxGuard implements CanActivate {
  constructor(private deliriumClient: DeliriumClient) {}

  canActivate(): boolean | Promise<boolean> {
    if (!this.deliriumClient.isAuthenticated()) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
