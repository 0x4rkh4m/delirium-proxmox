import { CookieJar } from 'tough-cookie';

export class LoginResponse {
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

  getTicket(): string {
    return this.ticket;
  }
}
