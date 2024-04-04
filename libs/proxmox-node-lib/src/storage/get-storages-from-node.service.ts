import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { StoragesResponse } from '@delirium/proxmox-node-lib/storage/dto/storages-response.dto';
import { StorageResponse } from '@delirium/proxmox-node-lib/storage/dto/storage-response.dto';

@Injectable()
export class GetStoragesFromNodeService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async getStorages(node: string): Promise<StoragesResponse | null> {
    try {
      const result = await firstValueFrom(
        this.httpService.get(
          `${this.connection.getUri()}/nodes/${node}/storage`,
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
        throw new HttpException('Storages Not Found', 404);
      }

      const storages = result.data.map(this.toResponse);

      return new StoragesResponse(storages);
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

  private toResponse(result: any): StorageResponse {
    return new StorageResponse(
      result['type'] || '',
      result['used'] || 0,
      result['avail'] || 0,
      result['total'] || 0,
      result['enabled'] === 1,
      result['storage'] || '',
      result['used_fraction'] || 0.0,
      result['content'] ? result['content'].split(',') : [],
      result['active'] === 1,
      result['shared'] === 1,
    );
  }
}