import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Connection } from '../common/model/connection.model';
import { CookiesPVE } from '../common/model/cookie-pve.model';
import { NodesResponse } from './dto/nodes-response.dto';
import { firstValueFrom } from 'rxjs';
import { NodesNotFoundException } from './exception/nodes-not-found.exception';
import { AuthFailedException } from '../common/exception/auth-failed.exception';
import { HostUnreachableException } from '../common/exception/host-unreachable.exception';
import { NodeResponse } from './dto/node-response.dto';

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
            Cookie: await this.cookiesPVE.getCookiesAsString(
              this.connection.getUri(),
            ),
          },
        }),
      );

      if (!result.data.length) {
        throw new NodesNotFoundException();
      }

      const nodes = result.data.map(this.toResponse);

      return new NodesResponse(nodes);
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
