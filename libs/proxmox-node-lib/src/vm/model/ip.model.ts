export class IpModel {
  private text: string;

  constructor(
    private readonly index: number | null,
    private readonly ip: string | null,
    private readonly gateway: string | null,
  ) {
    this.text = '';
  }

  getIndex(): number | null {
    return this.index;
  }

  getIp(): string | null {
    return this.ip;
  }

  getGateway(): string | null {
    return this.gateway;
  }

  toString(): string {
    if (this.getIp()) this.text += 'ip=' + this.getIp();
    if (this.getGateway()) this.text += ',gw=' + this.getGateway();
    return this.text;
  }
}
