export class NetworkResponse {
  constructor(
    private method: string,
    private bridge_fd: string,
    private active: boolean,
    private iface: string,
    private priority: number,
    private type: string,
    private autostart: boolean,
    private method6: string,
    private bridge_stp: string,
    private netmask: string,
    private cidr: string,
    private bridge_ports: string,
    private gateway: string,
    private families: any[],
    private address: string,
  ) {}

  getMethod(): string {
    return this.method;
  }

  getBridgeFd(): string {
    return this.bridge_fd;
  }

  getActive(): boolean {
    return this.active;
  }

  getIface(): string {
    return this.iface;
  }

  getPriority(): number {
    return this.priority;
  }

  getType(): string {
    return this.type;
  }

  getAutostart(): boolean {
    return this.autostart;
  }

  getMethod6(): string {
    return this.method6;
  }

  getBridgeStp(): string {
    return this.bridge_stp;
  }

  getNetmask(): string {
    return this.netmask;
  }

  getCidr(): string {
    return this.cidr;
  }

  getBridgePorts(): string {
    return this.bridge_ports;
  }

  getGateway(): string {
    return this.gateway;
  }

  getFamilies(): any[] {
    return this.families;
  }

  getAddress(): string {
    return this.address;
  }
}
