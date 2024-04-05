import { VmResponse } from './vm-response.dto';

export class VmsResponse {
  constructor(private vms: VmResponse[]) {}

  getVms(): VmResponse[] {
    return this.vms;
  }
}
