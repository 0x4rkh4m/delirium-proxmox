import { CookieJar } from 'tough-cookie';

export class CookiesPVE {
  constructor(
    private CSRFPreventionToken: string,
    private cookies: CookieJar,
    private ticket: string,
  ) {}

  getCSRFPreventionToken(): string {
    return this.CSRFPreventionToken;
  }

  getCookies(): CookieJar {
    return this.cookies;
  }

  async getCookiesAsString(connectionUri: string): Promise<string> {
    return await this.cookies.getCookieString(connectionUri);
  }

  getTicket(): string {
    return this.ticket;
  }
}
