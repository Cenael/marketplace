import { ModelUser } from "./User";

export class ModelAuth {
  referenceKeyUser: ModelUser["primaryKeyUser"];
  token: number;
  primaryKeyAuth: number;

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    this.primaryKeyAuth = Math.random();
    this.token = Math.random();
    this.referenceKeyUser = referenceKeyUser;
  }
}
