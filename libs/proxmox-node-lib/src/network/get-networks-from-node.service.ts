import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Connection } from '../common/model/connection.model';
import { CookiesPVE } from '../common/model/cookie-pve.model';
import { NetworksResponse } from './dto/networks-response.dto';
import { firstValueFrom } from 'rxjs';
import { NetworksNotFoundException } from './exception/network-not-found.exception';
import { AuthFailedException } from '../common/exception/auth-failed.exception';
import { HostUnreachableException } from '../common/exception/host-unreachable.exception';
import { NetworkResponse } from './dto/network-response.dto';

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
              Cookie: await this.cookiesPVE.getCookiesAsString(
                this.connection.getUri(),
              ),
            },
          },
        ),
      );

      if (!result.data.length) {
        throw new NetworksNotFoundException();
      }

      const networks = result.data.map(this.toResponse);

      return new NetworksResponse(networks);
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
