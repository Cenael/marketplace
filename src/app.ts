import { ModelAd } from "./models/Ad";
import { ModelReview } from "./models/Review";
import { ModelUser } from "./models/User";
import { ModelAuth } from "./models/Auth";
import { ModelFavourite } from "./models/Favourite";
import { ModelDevice } from "./models/Device";
import { ModelReport } from "./models/Report";
import { DocAPI } from "./models/DocAPI";

export class Marketplace {
  users: Array<ModelUser> = [];
  ads: Array<ModelAd> = [];
  reviews: Array<ModelReview> = [];
  auth: Array<ModelAuth> = [];
  reports: Array<ModelReport> = [];
  favourites: Array<ModelFavourite> = [];
  devices: Array<ModelDevice> = [];

  register(email: ModelUser["email"], password: ModelUser["password"]) {
    const userFound = this.users.find(function (user) {
      if (user.email === email) return true;
      else return false;
    });
    if (!!userFound) {
      return false;
    } else {
      const newUser = new ModelUser(email, email, password);
      this.users = [...this.users, newUser];
      return true;
    }
  }
  readDevice(deviceName: ModelDevice["deviceName"], token: ModelAuth["token"]) {
    //ogni utente può avere massimo due device
    //controllo se già esist il device
    const auth = this.getUserByToken(token);
    if (!auth) return console.log("Invalid Token");

    const deviceFiltered = this.devices.filter((device) => {
      if (device.referenceKeyUser === auth.referenceKeyUser) return true;
      else return false;
    });
    if (deviceFiltered.length >= 2) {
      console.log("You have reached the maximum device's number");
      return false;
    } else {
      const deviceFound = this.devices.find(function (device) {
        if (device.deviceName === deviceName) return true;
        else return false;
      });
      if (!!deviceFound) {
        console.log("device already registered");
        return false;
      } else {
        const newDevice = new ModelDevice(deviceName, auth.referenceKeyUser);
        this.devices = [...this.devices, newDevice];
        return true;
      }
    }
  }
  login(username: string, password: string, deviceName: string) {
    const authFound = this.users.find(function (user) {
      if (user.username === username && user.password === password) return true;
      else return false;
    });
    if (!authFound) return console.log("User not found");
    else {
      const token = new ModelAuth(authFound.primaryKeyUser);
      this.auth = [...this.auth, token];
      const tokenValue = token.token;
      this.readDevice(deviceName, tokenValue);
      return tokenValue;
    }
  }

  logout(token: ModelAuth["token"]) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("User not logged in");
    } else {
      this.auth = this.auth.filter(function (auth) {
        if (auth.token !== token) return true;
        else return false;
      });
      console.log("Succesfully logged out");
      return true;
    }
  }

  getUserByToken(token: ModelAuth["token"]) {
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });
    if (!authFound) return null;
    else return authFound;
  }

  readToken(token: ModelAuth["token"]) {
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });
    if (!authFound) return null;
    else return authFound.token;
  }

  createAd(
    token: ModelAuth["token"],
    title: ModelAd["title"],
    description: ModelAd["description"],
    category: ModelAd["category"],
    status: ModelAd["status"],
    price: ModelAd["price"],
    urlPhoto: ModelAd["urlPhoto"],
    address: ModelAd["address"],
    phone: ModelAd["phone"]
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return false;
    }

    const newAd = new ModelAd(
      title,
      description,
      category,
      status,
      price,
      urlPhoto,
      address,
      auth.referenceKeyUser,
      phone
    );
    this.ads = [...this.ads, newAd];
    console.log("Ad successfully created!");
    if (newAd) return newAd;
    else return false;
  }

  readAdDetail(referenceKeyAd: ModelAd["primaryKeyAd"]) {
    const adFound = this.ads.find((ad) => {
      return ad.primaryKeyAd === referenceKeyAd;
    });
    if (!adFound) {
      console.log("Ad not found");
      return null;
    }
    return adFound;
  }

  readAdList() {
    return this.ads;
  }

  readUserList() {
    return this.users;
  }
  createReport(
    token: ModelAuth["token"],
    referenceKeyAd: ModelAd["primaryKeyAd"],
    description: string,
    status: string
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });
    if (!adFound) {
      console.log("Unfound Ad");
      return;
    }
    const newReport = new ModelReport(
      adFound.primaryKeyAd,
      auth.referenceKeyUser,
      description,
      status
    );
    this.reports = [...this.reports, newReport];
    console.log("Report successfully created!");
    return newReport;
  }

  updateAd(
    referenceKeyAd: ModelAd["primaryKeyAd"],
    token: ModelAuth["token"],
    title: string,
    description: string,
    category: string,
    status: string,
    price: number,
    urlPhoto: string,
    address: string,

    phone: number
  ) {
    let updatedAd = undefined;
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return false;
    } else {
      console.log(referenceKeyAd);
      const adFound = this.ads.find(function (ad) {
        if (ad.primaryKeyAd === referenceKeyAd) return true;
        else return false;
      });
      console.log(adFound);
      if (!adFound) {
        console.log("Unfound Ad");
        return false;
      } else {
        updatedAd = this.ads.map((ad) => {
          if (ad.referenceKeyUser === auth.referenceKeyUser)
            return {
              ...ad,
              title: title,
              description: description,
              category: category,
              status: status,
              price: price,
              urlPhoto: urlPhoto,
              address: address,
              phone: phone,
            };
          else return ad;
        });

        this.ads = updatedAd;
      }
      if (!updatedAd) return false;
      else console.log("Succesfully updated Ad");
      return updatedAd;
    }
  }
  //dato l'id del Ad creato dall'utente, solo lo stesso che lo ha creato può accedervi (attraverso il token), verificare se è presente all'interno dell'array ads e modificarlo

  deleteAd(referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"]) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      //dato l'id del Ad creato dall'utente, verifica se l'utente è lo stesso che lo ha creato (attraverso il token) e lo elimina
      return;
    }
    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });

    if (!adFound) {
      console.log("Unfound Ad");
      return;
    }
    this.ads = this.ads.filter(function (ad) {
      if (adFound.primaryKeyAd !== ad.primaryKeyAd) return true;
      else return false;
    });
    console.log("Succesfully removed Ad");
    return true;
  }

  readPhoneNumber(
    token: ModelAuth["token"],
    referenceKeyAd: ModelAd["primaryKeyAd"]
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });

    if (!adFound) {
      console.log("Unfound Ad");
      return;
    }
    adFound.lead = [...adFound.lead, auth];
    return adFound.phone;
  }

  readLeadList(
    token: ModelAuth["token"],
    referenceKeyAd: ModelAd["primaryKeyAd"]
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return false;
    }
    const adFound = this.ads.find((ad) => {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });
    if (!adFound) {
      console.log("Unfound Ad");
      return false;
    }
    console.log(adFound.lead);
    return adFound.lead;
  }

  createReview(
    referenceKeyUser: ModelUser["primaryKeyUser"],
    token: ModelAuth["token"],
    referenceKeyAd: ModelAd["primaryKeyAd"],
    title: string,
    description: string,
    rating: number
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const newReview = new ModelReview(
      referenceKeyUser,
      title,
      description,
      rating,
      referenceKeyAd
    );
    this.reviews = [...this.reviews, newReview];
    console.log("Review succesfully created!");
    return newReview;
  }

  deleteReview(
    referenceKeyReview: ModelReview["primaryKeyReview"],
    token: ModelAuth["token"]
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const reviewFound = this.reviews.find((review) => {
      return review.primaryKeyReview === referenceKeyReview;
    });

    if (reviewFound) {
      this.reviews = this.reviews.filter((review) => {
        return reviewFound.primaryKeyReview !== review.primaryKeyReview;
      });
      console.log("Succesfully Review Removed");
      return true;
    }
  }

  deleteAccount(
    referenceKeyUser: ModelUser["primaryKeyUser"],
    token: ModelAuth["token"]
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const userFound = this.users.find((user) => {
      return user.primaryKeyUser === referenceKeyUser;
    });
    if (userFound)
      this.users = this.users.filter((user) => {
        if (userFound.primaryKeyUser !== user.primaryKeyUser) {
          return true;
        } else return false;
      });
    console.log("Account succesfully deleted");
    return true;
  }

  updateUsername(newUsername: string, token: ModelAuth["token"]) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return false;
    }
    this.users = this.users.map((user) => {
      if (user.primaryKeyUser === auth.referenceKeyUser) {
        return { ...user, username: newUsername };
      } else return { ...user };
    });
    return true;
  }

  updateAdAsSold(
    token: ModelAuth["token"],
    referenceKeyAd: ModelAd["primaryKeyAd"],
    referenceKeyUserPurchased: ModelAd["referenceKeyUserPurchased"]
  ) {
    const authFound = this.getUserByToken(token);
    if (!authFound) {
      console.log("Invalid Token");
    } else {
      const adFound = this.ads.find(function (ad) {
        if (ad.primaryKeyAd === referenceKeyAd) return true;
        else return false;
      });
      if (!adFound) console.log("Ad not found");
      else {
        if (adFound.referenceKeyUser !== authFound.referenceKeyUser) {
          console.log("Unknown User");
        }
        if (adFound.referenceKeyUserPurchased !== 0)
          console.log("Ad already sold");
        else {
          this.ads = this.ads.map(function (ad) {
            if (adFound.primaryKeyAd === ad.primaryKeyAd) {
              return {
                ...ad,
                referenceKeyUserPurchased: referenceKeyUserPurchased,
              };
            } else return { ...ad };
          });
          return true;
        }
      }
    }
  }

  readFilteredAd(
    token: ModelAuth["token"],
    price: number,
    category: string,
    status: string
  ) {
    const authFound = this.getUserByToken(token);
    if (!authFound) {
      console.log("Invalid Token");
    } else {
      const filteredAds = this.ads.filter(function (ad) {
        if (
          ad.price === price ||
          ad.category === category ||
          ad.status === status
        )
          return true;
        else return false;
      });
      return filteredAds;
    }
  }
  //alcuni cambi saranno delle stringhe ben precise

  readAdListByText(text: string) {
    const filteredAds = this.ads.filter((ad) => {
      if (
        ad.description.toLowerCase() &&
        ad.title.toLowerCase() == text.toLowerCase()
      )
        return true;
      else return false;
    });
    return filteredAds;

    //filtra in ads gli oggetti che contengono il testo inserito
  }

  createFavouriteAdList(
    referenceKeyAd: ModelAd["primaryKeyAd"],
    token: ModelAuth["token"]
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });
    if (!adFound) console.log("Ad not found");
    else {
      let favouriteFound = this.favourites.find((favourite) => {
        if (
          favourite.referenceKeyUser === auth.referenceKeyUser &&
          favourite.referenceKeyAd === referenceKeyAd
        )
          return true;
        else return false;
      });
      if (!!favouriteFound) console.log("Ad already added to favourites");
      else {
        const newFavourite = new ModelFavourite(
          auth.referenceKeyUser,
          referenceKeyAd
        );
        this.favourites = [...this.favourites, newFavourite];
      }
      return true;
      //verificare se il token corrisponde all'utente
    }
  }

  readFavouriteAdList(token: ModelAuth["token"]) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const favouriteFound = this.favourites.filter((favourite) => {
      if (favourite.referenceKeyUser === auth.referenceKeyUser) return true;
      else return false;
    });
    return favouriteFound;
  }

  deleteFavouriteAd(
    referenceKeyAd: ModelAd["primaryKeyAd"],
    token: ModelAuth["token"]
  ) {
    const auth = this.getUserByToken(token);
    if (!auth) {
      console.log("Invalid Token");
      return;
    }
    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });
    if (!adFound) console.log("Ad not found");
    else {
      this.ads = this.ads.filter((ad) => {
        if (adFound.primaryKeyAd !== ad.primaryKeyAd) return true;
        else return false;
      });
      console.log("Succesfully removed Ad");
    }
    return true;
  }
}

const apis = {
  register: new DocAPI("auth/register", "POST", false),
  login: new DocAPI("/auth/login", "POST", false),
  logout: new DocAPI("auth/logout", "GET", true),
  createAd: new DocAPI("/ads", "POST", true),
  readDevice: new DocAPI("/devices/{primaryKey}", "GET", true),
  createReport: new DocAPI("/reports", "POST", true),
  updateAd: new DocAPI("/ads/{primaryKey}", "PUT", true),
  deleteAd: new DocAPI("/ads/{primaryKey}", "DELETE", true),
  readPhoneNumber: new DocAPI("/ads/{primaryKey}", "GET", true),
  readLeadsList: new DocAPI("/leads", "GET", true),
  createReview: new DocAPI("/ads/{primaryKeyAd}/reviews", "POST", true),
  deleteReview: new DocAPI("ads/reviews/{primaryKeyReview}", "DELETE", true),
  deleteAccount: new DocAPI("/users/{primaryKey}", "DELETE", true),
  updateUsername: new DocAPI("/users/{primaryKey}", "PATCH", true),
  updateAdAsSold: new DocAPI("/ads/{primaryKey}", "PATCH", true),
  filterList: new DocAPI("/ads", "GET", true),
  createFavourite: new DocAPI("/users/", "POST", true),
  deleteFavouriteAd: new DocAPI("/favourites/{primaryKey}", "DELETE", true),
  readAdListByText: new DocAPI("/ads", "GET", true),
  readFavouriteAdList: new DocAPI("/favourites", "GET", true),
};
