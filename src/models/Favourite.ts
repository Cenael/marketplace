import { ModelUser } from "./User";
import { ModelAd } from "./Ad";

export class ModelFavourite {
  primaryKey: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  referenceKeyAd: ModelAd["primaryKeyAd"];
  constructor(
    referenceKeyUser: ModelUser["primaryKeyUser"],
    referenceKeyAd: ModelAd["primaryKeyAd"]
  ) {
    this.primaryKey = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyAd = referenceKeyAd;
  }
}
