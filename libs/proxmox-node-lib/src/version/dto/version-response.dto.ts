export class VersionResponse {
  constructor(
    private release: string,
    private repoid: string,
    private version: string,
  ) {}

  getRelease(): string {
    return this.release;
  }

  getRepoid(): string {
    return this.repoid;
  }

  getVersion(): string {
    return this.version;
  }
}
