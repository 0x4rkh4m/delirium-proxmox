import { NetworkResponse } from '@delirium/proxmox-node-lib/network/dto/network-response.dto';

export class NetworksResponse {
  constructor(private networks: NetworkResponse[]) {}

  getNetworks(): NetworkResponse[] {
    return this.networks;
  }
}
