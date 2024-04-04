export class CpuResponse {
  constructor(
    private vendor: string,
    private name: string,
    private custom: number,
  ) {}

  getVendor(): string {
    return this.vendor;
  }

  getName(): string {
    return this.name;
  }

  getCustom(): number {
    return this.custom;
  }
}