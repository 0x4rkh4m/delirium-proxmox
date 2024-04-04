import { Module } from '@nestjs/common';
import { GetVersionFromProxmoxService } from './get-version-from-node.service';

@Module({
  providers: [GetVersionFromProxmoxService]
})
export class VersionModule {}
