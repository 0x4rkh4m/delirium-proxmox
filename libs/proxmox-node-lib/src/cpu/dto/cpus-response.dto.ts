import { CpuResponse } from './cpu-response.dto';

export class CpusResponse {
  constructor(private cpus: CpuResponse[]) {}

  getCpus(): CpuResponse[] {
    return this.cpus;
  }
}
