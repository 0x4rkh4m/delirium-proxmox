import { Module } from '@nestjs/common';
import { GetStoragesFromNodeService } from './get-storages-from-node.service';
import { StoragesNotFoundException } from '@delirium/proxmox-node-lib/storage/exception/storages-not-found.exception';

@Module({
  providers: [GetStoragesFromNodeService],
})
export class StorageModule {}
