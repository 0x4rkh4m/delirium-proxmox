import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { CpusResponse } from '@delirium/proxmox-node-lib/cpu/dto/cpus-response.dto';
import { CpuResponse } from '@delirium/proxmox-node-lib/cpu/dto/cpu-response.dto';

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
        throw new Error('CPU Not Found');
      }

      const cpus = result.data.map(this.toResponse);

      return new CpusResponse(cpus);
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (error.response.status === 0) {
        throw new Error('Host Unreachable');
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
