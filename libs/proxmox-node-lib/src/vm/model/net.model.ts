export class NetModel {
  private text: string;

  constructor(
    private readonly index: number | null,
    private readonly model: string | null,
    private readonly bridge: string | null,
    private readonly firewall: number | null,
  ) {
    this.text = '';
  }

  getIndex(): number | null {
    return this.index;
  }

  getModel(): string | null {
    return this.model;
  }

  getBridge(): string | null {
    return this.bridge;
  }

  getFirewall(): number | null {
    return this.firewall;
  }

  toString(): string {
    if (this.getModel()) this.text += 'model=' + this.getModel();
    if (this.getBridge()) this.text += ',bridge=' + this.getBridge();
    if (this.getFirewall()) this.text += ',firewall=' + this.getFirewall();
    return this.text;
  }
}
