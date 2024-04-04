export class Connection {
  private readonly uri: string;

  constructor(
    private host: string,
    private port: number,
    private username: string,
    private password: string,
    private realm: string,
  ) {
    this.uri = `https://${this.host}:${this.port}/api2/json/`;
  }

  getHost(): string {
    return this.host;
  }

  getPort(): number {
    return this.port;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getUri(): string {
    return this.uri;
  }

  getRealm(): string {
    return this.realm;
  }
}
