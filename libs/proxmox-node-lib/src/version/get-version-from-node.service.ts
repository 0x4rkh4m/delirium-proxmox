import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { VersionResponse } from '@delirium/proxmox-node-lib/version/dto/version-response.dto';
import { AuthFailedException } from '@delirium/proxmox-node-lib/common/exception/auth-failed.exception';
import { HostUnreachableException } from '@delirium/proxmox-node-lib/common/exception/host-unreachable.exception';

export class GetVersionFromNodeService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async getVersion(): Promise<VersionResponse | null> {
    try {
      const result = await firstValueFrom(
        this.httpService.get(`${this.connection.getUri()}/version`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: await this.cookiesPVE.getCookiesAsString(
              this.connection.getUri(),
            ),
          },
        }),
      );

      if (!result.data) {
        throw new Error('Version Not Found');
      }

      return this.toResponse(result.data);
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

  private toResponse(result: any): VersionResponse {
    return new VersionResponse(
      result['release'] || '',
      result['repoid'] || '',
      result['version'] || '',
    );
  }
}
