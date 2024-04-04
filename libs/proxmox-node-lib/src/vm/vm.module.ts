import { Module } from '@nestjs/common';
import { ConfigVminNodeService } from './config-vmin-node.service';
import { CreateVminNodeService } from './create-vmin-node.service';
import { ResizeVmDiskService } from './resize-vm-disk.service';

@Module({
  providers: [ConfigVminNodeService, CreateVminNodeService, ResizeVmDiskService]
})
export class VmModule {}
