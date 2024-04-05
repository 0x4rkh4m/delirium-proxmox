import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { AuthFailedException } from '@delirium/proxmox-node-lib/common/exception/auth-failed.exception';
import { HostUnreachableException } from '@delirium/proxmox-node-lib/common/exception/host-unreachable.exception';
import { ConfigVMException } from '@delirium/proxmox-node-lib/vm/exception/vm-error-config.exception';

export class ConfigVMinNodeService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async configVM(
    node: string,
    vmid: number,
    index?: number,
    discard?: string,
    cache?: string,
    importFrom?: string,
  ): Promise<string | null> {
    try {
      const body = {
        [`scsi${index}`]: `discard=${discard}`,
        [`scsi${index}`]: `file=local-lvm:vm-102-disk-0,size=32`,
        [`scsi${index}`]: `cache=${cache}`,
        [`scsi${index}`]: `import-from=${importFrom}`,
      };

      const result = await firstValueFrom(
        this.httpService.post(
          `${this.connection.getUri()}/nodes/${node}/qemu/${vmid}/config`,
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
        throw new ConfigVMException();
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
