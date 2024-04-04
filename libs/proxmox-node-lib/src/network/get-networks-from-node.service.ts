import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { NetworkResponse } from '@delirium/proxmox-node-lib/network/dto/network-response.dto';
import { NetworksResponse } from '@delirium/proxmox-node-lib/network/dto/networks-response.dto';

@Injectable()
export class GetNetworksFromNodeService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async getNetworks(node: string): Promise<NetworksResponse | null> {
    try {
      const result = await firstValueFrom(
        this.httpService.get(
          `${this.connection.getUri()}/nodes/${node}/network`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Cookie: this.cookiesPVE.getCookies(),
            },
          },
        ),
      );

      if (!result.data.length) {
        throw new HttpException('Networks Not Found', 404);
      }

      const networks = result.data.map(this.toResponse);

      return new NetworksResponse(networks);
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

  private toResponse(result: any): NetworkResponse {
    return new NetworkResponse(
      result['method'] || null,
      result['bridge_fd'] || '',
      result['active'] === 1,
      result['iface'] || null,
      result['priority'] || null,
      result['type'] || null,
      result['autostart'] === 1,
      result['method6'] || '',
      result['bridge_stp'] || '',
      result['netmask'] || '',
      result['cidr'] || '',
      result['bridge_ports'] || '',
      result['gateway'] || '',
      result['families'] || [],
      result['address'] || '',
    );
  }
}
