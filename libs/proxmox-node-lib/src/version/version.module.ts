import { Module } from '@nestjs/common';
import { GetVersionFromNodeService } from './get-version-from-node.service';

@Module({
  providers: [GetVersionFromNodeService],
})
export class VersionModule {}
