export class VmResponse {
  constructor(private data: string) {}

  getData(): string {
    return this.data;
  }
}
