export class CpuModel {
  constructor(
    private readonly cpuTypes: string,
    private readonly cores: number,
    private readonly memory: number,
    private readonly ballon: number,
  ) {}

  getCpuTypes(): string {
    return this.cpuTypes;
  }

  getCores(): number {
    return this.cores;
  }

  getMemory(): number {
    return this.memory;
  }

  getBallon(): number {
    return this.ballon;
  }
}
