export class IdeModel {
  constructor(
    private index: number,
    private file: string,
  ) {}

  getIndex(): number {
    return this.index;
  }

  getFile(): string {
    return this.file;
  }
}
