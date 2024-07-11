export class ModelUser {
  username: string;
  email: string;
  password: string;
  primaryKeyUser: string;
  constructor(username: string, email: string, password: string) {
    this.primaryKeyUser = Math.random().toString(16).slice(2);
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
