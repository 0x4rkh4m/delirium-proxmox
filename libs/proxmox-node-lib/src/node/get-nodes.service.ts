import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { NodesResponse } from '@delirium/proxmox-node-lib/node/dto/nodes-response.dto';
import { NodeResponse } from '@delirium/proxmox-node-lib/node/dto/node-response.dto';

@Injectable()
export class GetNodesService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async getNodes(): Promise<NodesResponse | null> {
    try {
      const result = await firstValueFrom(
        this.httpService.get(`${this.connection.getUri()}/nodes`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: this.cookiesPVE.getCookies(),
          },
        }),
      );

      const nodes = result.data.map(this.toResponse);

      return new NodesResponse(nodes);
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

  private toResponse(result: any): NodeResponse {
    return new NodeResponse(
      result['status'],
      result['level'],
      result['id'],
      result['ssl_fingerprint'],
      result['maxmem'],
      result['disk'],
      result['uptime'],
      result['mem'],
      result['node'],
      result['cpu'],
      result['maxcpu'],
      result['type'],
      result['maxdisk'],
    );
  }
}
