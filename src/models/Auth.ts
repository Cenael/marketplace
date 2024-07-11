import { ModelUser } from "./User";

export class ModelAuth {
  referenceKeyUser: ModelUser["primaryKeyUser"];
  token: string;
  primaryKeyAuth: string;

  constructor(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    this.primaryKeyAuth = Math.random().toString(16).slice(2);;
    this.token =  Math.random().toString(16).slice(2);
    this.referenceKeyUser = referenceKeyUser;
  }
}
