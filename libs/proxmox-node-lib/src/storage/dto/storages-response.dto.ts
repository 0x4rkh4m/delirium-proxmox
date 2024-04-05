import { StorageResponse } from './storage-response.dto';

export class StoragesResponse {
  constructor(private storages: StorageResponse[]) {}

  getStorages(): StorageResponse[] {
    return this.storages;
  }
}
