import { Module } from '@nestjs/common';
import { GetStoragesFromNodeService } from './get-storages-from-node.service';

@Module({
  providers: [GetStoragesFromNodeService]
})
export class StorageModule {}
