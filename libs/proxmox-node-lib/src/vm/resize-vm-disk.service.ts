import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { AuthFailedException } from '@delirium/proxmox-node-lib/common/exception/auth-failed.exception';
import { HostUnreachableException } from '@delirium/proxmox-node-lib/common/exception/host-unreachable.exception';

export class ResizeVMDiskService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async resizeDisk(
    node: string,
    vmid: number,
    disk?: string,
    size?: string,
  ): Promise<string | null> {
    try {
      const body = {
        disk,
        size,
      };

      const result = await firstValueFrom(
        this.httpService.put(
          `${this.connection.getUri()}/nodes/${node}/qemu/${vmid}/resize`,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Cookie: await this.cookiesPVE.getCookiesAsString(
                this.connection.getUri(),
              ),
            },
          },
        ),
      );

      if (!result.data) {
        throw new Error('Error in resize VM disk');
      }

      return result.data;
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
