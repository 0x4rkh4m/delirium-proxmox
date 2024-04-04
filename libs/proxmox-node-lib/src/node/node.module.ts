import { Module } from '@nestjs/common';
import { GetNodesService } from './get-nodes.service';

@Module({
  providers: [GetNodesService]
})
export class NodeModule {}
