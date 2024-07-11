import { ModelAd } from "./Ad";
import { ModelUser } from "./User";

export class ModelReview {
  primaryKeyReview: string;
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
    this.primaryKeyReview =  Math.random().toString(16).slice(2);;
    this.referenceKeyUser = referenceKeyUser;
    this.title = title;
    this.description = description;
    this.rating = rating;
    this.date = new Date();
    this.referenceKeyAd = referenceKeyAd;
  }
}
