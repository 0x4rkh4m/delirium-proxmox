export class NodeResponse {
  constructor(
    private status: string,
    private level: string,
    private id: string,
    private sslFingerprint: string,
    private maxmem: number,
    private disk: number,
    private uptime: number,
    private mem: number,
    private node: string,
    private cpu: number,
    private maxcpu: number,
    private type: string,
    private maxdisk: number,
  ) {}

  getStatus(): string {
    return this.status;
  }

  getLevel(): string {
    return this.level;
  }

  getId(): string {
    return this.id;
  }

  getSslFingerprint(): string {
    return this.sslFingerprint;
  }

  getMaxmem(): number {
    return this.maxmem;
  }

  getDisk(): number {
    return this.disk;
  }

  getUptime(): number {
    return this.uptime;
  }

  getMem(): number {
    return this.mem;
  }

  getNode(): string {
    return this.node;
  }

  getCpu(): number {
    return this.cpu;
  }

  getMaxcpu(): number {
    return this.maxcpu;
  }

  getType(): string {
    return this.type;
  }

  getMaxdisk(): number {
    return this.maxdisk;
  }
}
