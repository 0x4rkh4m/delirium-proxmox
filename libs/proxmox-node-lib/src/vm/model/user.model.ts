export class UserModel {
  private text: string;

  constructor(private readonly username: string, private readonly password: string) {
    this.text = '';
  }

  getUserName(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  toString(): string {
    if (this.getUserName()) this.text += this.getUserName();
    if (this.getPassword()) this.text += ' --cipassword=' + this.getPassword();
    return this.text;
  }
}
