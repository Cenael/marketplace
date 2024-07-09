import { ModelAd } from "./Ad";
import { ModelUser } from "./User";

export class ModelReview {
  primaryKeyReview: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  title: string;
  description: string;
  rating: number;
  date: Date;
  referenceKeyAd: ModelAd["primaryKeyAd"];
  constructor(
    referenceKeyUser: ModelUser["primaryKeyUser"],
    title: string,
    description: string,
    rating: number,
    referenceKeyAd: ModelAd["primaryKeyAd"]
  ) {
    this.primaryKeyReview = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.title = title;
    this.description = description;
    this.rating = rating;
    this.date = new Date();
    this.referenceKeyAd = referenceKeyAd;
  }
}
