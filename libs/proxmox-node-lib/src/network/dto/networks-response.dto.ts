import { NetworkResponse } from './network-response.dto';

export class NetworksResponse {
  constructor(private networks: NetworkResponse[]) {}

  getNetworks(): NetworkResponse[] {
    return this.networks;
  }
}
