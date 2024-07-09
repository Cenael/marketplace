import { ModelAd } from "./Ad";
import { ModelUser } from "./User";

export class ModelReport {
  primaryKey: number;
  referenceKeyAd: ModelAd["primaryKeyAd"];
  referenceKeyUser: ModelUser["primaryKeyUser"];
  description: string;
  status: string;
  constructor(
    referenceKeyUser: ModelUser["primaryKeyUser"],
    referenceKeyAd: ModelAd["primaryKeyAd"],
    description: string,
    status: string
  ) {
    this.primaryKey = Math.random();
    this.referenceKeyAd = referenceKeyAd;
    this.referenceKeyUser = referenceKeyUser;
    this.description = description;
    this.status = status;
  }
}
