import { ModelUser } from "../models/User";
import { ModelAuth } from "../models/Auth";


export class ControllerUser {
  users: ModelUser[] = [];
  auth: ModelAuth[] = [];
  readDevice: any;

  register(email: string, password: string) {
    const userFound = this.users.find(function (user) {
      if (user.email === email) return true;
      else return false;
    });
    if (!!userFound) {
      return console.log("User already exists");
    } else {
      const newUser = new ModelUser(email, email, password);
      this.users = [...this.users, newUser];
    }
  }

  login(username: string, password: string, deviceName: string) {
    const authFound = this.users.find(function (user) {
      if (user.username === username && user.password === password) return true;
      else return false;
    });
    if (!authFound) return console.log("Invalid credentials");
    const token = new ModelAuth(authFound.primaryKeyUser);
    this.auth = [...this.auth, token];
    const tokenValue = token.token;
    this.readDevice(deviceName, tokenValue);
  }
}
