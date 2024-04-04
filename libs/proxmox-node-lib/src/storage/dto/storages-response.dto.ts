import { StorageResponse } from '@delirium/proxmox-node-lib/storage/dto/storage-response.dto';

export class StoragesResponse {
  constructor(private storages: StorageResponse[]) {}

  getStorages(): StorageResponse[] {
    return this.storages;
  }
}