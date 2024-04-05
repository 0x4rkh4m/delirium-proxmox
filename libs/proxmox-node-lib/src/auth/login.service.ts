import { Injectable, UseInterceptors } from '@nestjs/common';
import { CookieInterceptor } from '@delirium/proxmox-node-lib/common/interceptor/cookie.interceptor';
import { HttpService } from '@nestjs/axios';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { LoginResponse } from '@delirium/proxmox-node-lib/auth/dto/login-response.dto';
import { firstValueFrom } from 'rxjs';
import { AuthFailedException } from '@delirium/proxmox-node-lib/common/exception/auth-failed.exception';
import { HostUnreachableException } from '@delirium/proxmox-node-lib/common/exception/host-unreachable.exception';

@Injectable()
@UseInterceptors(CookieInterceptor)
export class LoginService {
  private defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  constructor(private httpService: HttpService) {}

  async login(connection: Connection): Promise<LoginResponse | null> {
    const body = {
      username: connection.getUsername(),
      password: connection.getPassword(),
      realm: connection.getRealm(),
    };

    try {
      const result = await firstValueFrom(
        this.httpService.post(`${connection.getUri()}access/ticket`, body, {
          headers: this.defaultHeaders,
        }),
      );

      const response = result.data;
      const cookies = result.request.cookies;

      return new LoginResponse(
        response['CSRFPreventionToken'],
        cookies,
        response['ticket'],
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }

    return null;
  }
}
