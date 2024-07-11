import { ModelUser } from "./User";

export class ModelAd {
  title: string;
  description: string;
  category: string;
  status: string;
  price: number;
  urlPhoto: string;
  address: string;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  phone: number;
  primaryKeyAd: string;
  createdAt: Date;
  referenceKeyUserPurchased: number;
  lead: Array<any>;
  constructor(
    title: string,
    description: string,
    category: string,
    status: string,
    price: number,
    urlPhoto: string,
    address: string,
    referenceKeyUser: ModelUser["primaryKeyUser"],
    phone: number
  ) {
    this.primaryKeyAd =  Math.random().toString(16).slice(2);;
    this.referenceKeyUser = referenceKeyUser;
    this.createdAt = new Date();
    this.title = title;
    this.description = description;
    this.category = category;
    this.status = status;
    this.price = price;
    this.urlPhoto = urlPhoto;
    this.address = address;
    this.referenceKeyUserPurchased = 0;
    this.phone = phone;
    this.lead = [];
  }
}
