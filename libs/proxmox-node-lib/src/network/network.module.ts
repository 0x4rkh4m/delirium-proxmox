import { Module } from '@nestjs/common';
import { GetNetworksFromNodeService } from './get-networks-from-node.service';

@Module({
  providers: [GetNetworksFromNodeService],
})
export class NetworkModule {}
