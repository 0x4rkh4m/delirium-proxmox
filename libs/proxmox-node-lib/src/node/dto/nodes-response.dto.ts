import { NodeResponse } from './node-response.dto';

export class NodesResponse {
  constructor(private nodes: NodeResponse[]) {}

  getNodes(): NodeResponse[] {
    return this.nodes;
  }
}
