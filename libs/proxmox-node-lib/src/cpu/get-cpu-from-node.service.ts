import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { CpusResponse } from '@delirium/proxmox-node-lib/cpu/dto/cpus-response.dto';
import { firstValueFrom } from 'rxjs';
import { CpusNotFoundException } from '@delirium/proxmox-node-lib/cpu/exception/cpu-not-found.exception';
import { AuthFailedException } from '@delirium/proxmox-node-lib/common/exception/auth-failed.exception';
import { HostUnreachableException } from '@delirium/proxmox-node-lib/common/exception/host-unreachable.exception';
import { CpuResponse } from '@delirium/proxmox-node-lib/cpu/dto/cpu-response.dto';

@Injectable()
export class GetCpuFromNodeService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async getCpu(node: string): Promise<CpusResponse | null> {
    try {
      const result = await firstValueFrom(
        this.httpService.get(
          `${this.connection.getUri()}/nodes/${node}/capabilities/qemu/cpu`,
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

      if (!result.data.length) {
        throw new CpusNotFoundException();
      }

      const cpus = result.data.map(this.toResponse);

      return new CpusResponse(cpus);
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

  private toResponse(result: any): CpuResponse {
    return new CpuResponse(
      result['vendor'] || '',
      result['name'] || '',
      result['custom'] || 0,
    );
  }
}
