import { Module } from '@nestjs/common';
import { ProxmoxNodeLibService } from './proxmox-node-lib.service';
import { AuthModule } from './auth/auth.module';
import { NodeModule } from './node/node.module';
import { StorageModule } from './storage/storage.module';
import { NetworkModule } from './network/network.module';
import { VmModule } from './vm/vm.module';
import { CpuModule } from './cpu/cpu.module';

@Module({
  providers: [ProxmoxNodeLibService],
  exports: [ProxmoxNodeLibService],
  imports: [AuthModule, NodeModule, StorageModule, NetworkModule, VmModule, CpuModule],
})
export class ProxmoxNodeLibModule {}
