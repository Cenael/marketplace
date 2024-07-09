import { ModelUser } from "./User";

export class ModelDevice {
  idDevice: number;
  deviceName: string;
  primaryKey: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  constructor(
    deviceName: string,
    referenceKeyUser: ModelUser["primaryKeyUser"]
  ) {
    this.idDevice = Math.random();
    this.deviceName = deviceName;
    this.primaryKey = Math.random();
    this.referenceKeyUser = referenceKeyUser;
  }
}
