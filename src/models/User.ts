export class ModelUser {
  username: string;
  email: string;
  password: string;
  primaryKeyUser: number;
  constructor(username: string, email: string, password: string) {
    this.primaryKeyUser = Math.random();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
