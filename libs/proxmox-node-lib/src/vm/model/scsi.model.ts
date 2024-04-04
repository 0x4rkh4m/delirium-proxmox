export class ScsiModel {
  private text: string;

  constructor(
    private readonly index: number | null,
    private readonly main: number | null,
    private readonly discard: string | null,
    private readonly cache: string | null,
    private readonly importFrom: string | null,
  ) {
    this.text = '';
  }

  getIndex(): number | null {
    return this.index;
  }

  getMain(): number | null {
    return this.main;
  }

  getDiscard(): string | null {
    return this.discard;
  }

  getCache(): string | null {
    return this.cache;
  }

  getImportFrom(): string | null {
    return this.importFrom;
  }

  toString(): string {
    if (this.getMain()) this.text += 'file=main:' + this.getMain();
    if (this.getDiscard()) this.text += ',discard=' + this.getDiscard();
    if (this.getCache()) this.text += ',cache=' + this.getCache();
    if (this.getImportFrom()) this.text += ',import-from=' + this.getImportFrom();
    return this.text;
  }
}
