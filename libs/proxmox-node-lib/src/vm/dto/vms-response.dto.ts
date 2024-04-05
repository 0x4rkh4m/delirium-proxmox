import { VmResponse } from '@delirium/proxmox-node-lib/vm/dto/vm-response.dto';

export class VmsResponse {
  constructor(private vms: VmResponse[]) {}

  getVms(): VmResponse[] {
    return this.vms;
  }
}
