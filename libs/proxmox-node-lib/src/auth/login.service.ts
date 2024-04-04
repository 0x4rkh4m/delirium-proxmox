import { Injectable, HttpException, UseInterceptors } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { LoginResponse } from '@delirium/proxmox-node-lib/auth/dto/login-response.dto';
import { CookieInterceptor } from '@delirium/proxmox-node-lib/common/interceptor/cookie.interceptor';

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
        throw new HttpException('Unauthorized', 401);
      }
      if (error.response.status === 0) {
        throw new HttpException('Host Unreachable', 500);
      }
    }

    return null;
  }
}
