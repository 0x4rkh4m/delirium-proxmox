import { Module } from '@nestjs/common';
import { GetCpuFromNodeService } from './get-cpu-from-node.service';

@Module({
  providers: [GetCpuFromNodeService],
})
export class CpuModule {}
