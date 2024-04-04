import { CpuResponse } from '@delirium/proxmox-node-lib/cpu/dto/cpu-response.dto';

export class CpusResponse {
  constructor(private cpus: CpuResponse[]) {}

  getCpus(): CpuResponse[] {
    return this.cpus;
  }
}
