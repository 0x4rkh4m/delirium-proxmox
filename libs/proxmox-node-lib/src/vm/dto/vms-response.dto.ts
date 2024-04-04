export class VmsResponse {
  constructor(private vms: VmResponse[]) {}

  getVms(): VmResponse[] {
    return this.vms;
  }
}