import { NodeResponse } from '@delirium/proxmox-node-lib/node/dto/node-response.dto';

export class NodesResponse {
  constructor(private nodes: NodeResponse[]) {}

  getNodes(): NodeResponse[] {
    return this.nodes;
  }
}