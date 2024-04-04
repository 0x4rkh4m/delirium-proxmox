export class StorageResponse {
  constructor(
    private type: string,
    private used: number,
    private avail: number,
    private total: number,
    private enabled: boolean,
    private storage: string,
    private used_fraction: number,
    private content: string[],
    private active: boolean,
    private shared: boolean,
  ) {}

  getType(): string {
    return this.type;
  }

  getUsed(): number {
    return this.used;
  }

  getAvail(): number {
    return this.avail;
  }

  getTotal(): number {
    return this.total;
  }

  getEnabled(): boolean {
    return this.enabled;
  }

  getStorage(): string {
    return this.storage;
  }

  getUsedFraction(): number {
    return this.used_fraction;
  }

  getContent(): string[] {
    return this.content;
  }

  getActive(): boolean {
    return this.active;
  }

  getShared(): boolean {
    return this.shared;
  }
}
