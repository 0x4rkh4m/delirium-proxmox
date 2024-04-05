import { Module } from '@nestjs/common';
import { ConfigVMinNodeService } from './config-vmin-node.service';
import { CreateVMinNodeService } from './create-vmin-node.service';
import { ResizeVMDiskService } from './resize-vm-disk.service';

@Module({
  providers: [
    ConfigVMinNodeService,
    CreateVMinNodeService,
    ResizeVMDiskService,
  ],
})
export class VmModule {}
