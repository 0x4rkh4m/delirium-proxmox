import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeliriumClient } from '../../delirium-client';

@Injectable()
export class ProxmoxGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const deliriumClient: DeliriumClient = request.deliriumClient;
    return deliriumClient.isAuthenticated();
  }
}
