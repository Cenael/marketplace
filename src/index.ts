import express, { Request, Response } from "express";
// import { routerUsers } from "./routers/users";
import { Marketplace } from "./app";
const marketplace = new Marketplace(); //istanziare la classe

const app = express(); //crea un'app express
const server = express.json(); //per istanziarlo formattare i dati che vengono passati dal client al server
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || "http://localhost:";
app.use(server);

// const routerApi = express.Router();
// routerApi.use("/users", routerUsers);

app.get("/api/ads", function (req: Request, res: Response) {
  const adList = marketplace.readAdList();
  return res.json(adList);
});

app.post("/api/auth/register", function (req: Request, res: Response) {
  const email = req.body.email; //dentro il body ci sono due chiavi che servono come parametri
  const password = req.body.password;
  if (!email) return res.status(400).json({ message: "Email not found" });
  if (!password) return res.status(400).json({ message: "Password not found" });
  const success = marketplace.register(email, password);
  if (success)
    return res.status(200).json({ message: "Succesfully registered" });
  else return res.status(400).json({ message: "Already registered" });
});

app.post("/api/auth/login", function (req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  const deviceName = req.body.deviceName;
  const authenticated = marketplace.login(username, password, deviceName);
  if (!!authenticated) return res.status(200).json({ token: authenticated });
  else return res.status(400).json({ message: "Unfound user" });
});

app.get("/api/auth/logout", function (req: Request, res: Response) {
  const token = req.headers.authorization;
  const logged = marketplace.logout(String(token));

  if (logged)
    return res.status(200).json({ message: "Succesfully logged out" });
  else return res.status(400).json({ message: "User not logged in" });
});

app.post("/api/ads", function (req: Request, res: Response) {
  const ad = req.body;
  const token = req.headers.authorization;
  console.log(ad);
  const created = marketplace.createAd(
    String(token),
    ad.title,
    ad.description,
    ad.category,
    ad.status,
    ad.price,
    ad.urlPhoto,
    ad.address,
    ad.phone
  );
  if (created) return res.status(200).json(created);
  else return res.status(400).json({ message: "Ad not created" });
});

app.post(
  "/api/ads/:primaryKeyAd/reviews",
  function (req: Request, res: Response) {
    const review = req.body;
    const token = req.headers.authorization;
    const created = marketplace.createReview(
      review.referenceKeyUser,
      String(token),
      req.params.primaryKeyAd,
      review.title,
      review.description,
      review.rating
    );
    if (created) return res.status(200).json(created);
    else return res.status(400).json({ message: "Review not created" });
  }
);

// app.get("/devices/:primaryKeyDevice"),
//   function (req: Request, res: Response) {
//     const token = req.headers.authorization;
//     const device = marketplace.readDevice(req.params.deviceName, String(token));

//     if (device) return res.status(200).json(device);
//     else return res.status(400).json({ message: "Device not found" });
//   };

app.post(
  "/api/ads/:primaryKeyAd/reports",
  function (req: Request, res: Response) {
    const report = req.body;
    const created = marketplace.createReport(
      String(req.headers.authorization),
      String(req.params.primaryKeyAd),
      report.description,
      report.status
    );
    if (created) return res.status(200).json(created);
    else return res.status(400).json({ message: "Report not created" });
  }
);

app.get("/api/users", function (req: Request, res: Response) {
  const userList = marketplace.readUserList();
  return res.json(userList);
});

app.put("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const ad = req.body;
  const updated = marketplace.updateAd(
    String(req.params.primaryKeyAd),
    String(req.headers.authorization),
    ad.title,
    ad.description,
    ad.category,
    ad.status,
    ad.price,
    ad.urlPhoto,
    ad.address,
    ad.phone
  );
  if (updated) return res.status(200).json(updated);
  else return res.status(400).json({ message: "Ad not updated" });
});

app.delete("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const deleted = marketplace.deleteAd(
    String(req.params.primaryKeyAd),
    String(req.headers.authorization)
  );
  if (deleted) return res.status(200).json({ message: "Succesfully deleted" });
  else return res.status(400).json({ message: "impossible to delete" });
});

app.get("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const read = marketplace.readPhoneNumber(
    String(req.headers.authorization),
    String(req.params.primaryKeyAd)
  );
  if (read) return res.status(200).json({ read });
  else return res.status(400).json({ message: "No phone number" });
});

app.delete(
  "/api/ads/reviews/:primaryKeyReview",
  function (req: Request, res: Response) {
    const deleted = marketplace.deleteReview(
      String(req.params.primaryKeyReview),
      String(req.headers.authorization)
    );
    if (deleted)
      return res.status(200).json({ message: "Succesfully deleted" });
    else return res.status(400).json({ message: "impossible to delete" });
  }
);

app.delete(
  "/api/users/:primaryKeyUser",
  function (req: Request, res: Response) {
    const deleted = marketplace.deleteAccount(
      String(req.params.primaryKeyUser),
      String(req.headers.authorization)
    );
    if (deleted)
      return res.status(200).json({ message: "Succesfully deleted" });
    else return res.status(400).json({ message: "impossible to delete" });
  }
);

app.patch("/api/users/:primaryKeyUser", function (req: Request, res: Response) {
  const username = req.body;
  const newUsername = marketplace.updateUsername(
    username.newUsername,
    String(req.headers.authorization)
  );
  if (newUsername)
    return res.status(200).json({ message: "Succesfully changed username" });
  else return res.status(400).json({ message: "Change username failed" });
});

app.patch("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const sold = req.body;
  const updated = marketplace.updateAdAsSold(
    String(req.headers.authorization),
    String(req.params.primaryKeyAd),
    sold.referenceKeyUserPurchased
  );
  if (updated) return res.status(200).json({ message: "Ad Sold" });
  else return res.status(400).json({ message: "Failed" });
});

app.get("/api/ad/search", function (req: Request, res: Response) {
  const { price, category, status } = req.query;
  const filteredList = marketplace.readFilteredAd(
    String(req.headers.authorization),
    Number(price),
    String(category),
    String(status)
  );

  if (filteredList) return res.status(200).json(filteredList);
  else return res.status(400).json({ message: "Ad not filtered" });
});

app.post("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const created = marketplace.createFavouriteAdList(
    String(req.params.primaryKeyAd),
    String(req.headers.authorization)
  );
  if (created) return res.status(200).json(created);
  else return res.status(400).json({ message: "Report not created" });
});

app.delete("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const deleted = marketplace.deleteFavouriteAd(
    String(req.params.primaryKeyAd),
    String(req.headers.authorization)
  );
  console.log(req.params.primaryKeyAd);
  if (deleted) return res.status(200).json({ message: "Succesfully deleted" });
  else return res.status(400).json({ message: "impossible to delete" });
});

app.get("/api/favourites", function (req: Request, res: Response) {
  const favouriteList = marketplace.readFavouriteAdList(
    String(req.headers.authorization)
  );
  return res.json(favouriteList);
});

app.get("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const filteredAd = marketplace.readAdListByText("text");
  if (filteredAd)
    return res.status(200).json({ message: "Succesfully filtered" });
  else return res.status(400).json({ message: "failed to filter" });
});

// app.get("/api/leads/:primaryKeyAd", function (req: Request, res: Response){
//     const leadsList = marketplace.readLeadList(
//          String(req.headers.authorization),
//     String(req.params.primaryKeyAd));
//     console.log(req.params.primaryKeyAd)
//     return res.json(leadsList)
// }

app.listen(port, () => {
  console.log(`Server is running on ${baseUrl}${port}`);
});

// const apis = {
//   register: new DocAPI("auth/register", "POST", false),
//   login: new DocAPI("/auth/login", "POST", false),
//   logout: new DocAPI("auth/logout", "GET", true),
//   createAd: new DocAPI("/ads", "POST", true),
//   readDevice: new DocAPI("/devices/{primaryKey}", "GET", true),
//   createReport: new DocAPI("/reports", "POST", true),
//   updateAd: new DocAPI("/ads/{primaryKey}", "PUT", true),
//   deleteAd: new DocAPI("/ads/{primaryKey}", "DELETE", true),
//   readPhoneNumber: new DocAPI("/ads/{primaryKey}", "GET", true),
//   readLeadsList: new DocAPI("/leads", "GET", true),
//   createReview: new DocAPI("/ads/{primaryKeyAd}/reviews", "POST", true),
//   deleteReview: new DocAPI("ads/reviews/{primaryKeyReview}", "DELETE", true),
//   deleteAccount: new DocAPI("/users/{primaryKey}", "DELETE", true),
//   updateUsername: new DocAPI("/users/{primaryKey}", "PATCH", true),
//   updateAdAsSold: new DocAPI("/ads/{primaryKey}", "PATCH", true),
//   filterList: new DocAPI("/ads", "GET", true),
//   createFavouriteAdList: new DocAPI("/favourites", "POST", true),
//   deleteFavouriteAd: new DocAPI("/favourites/{primaryKey}", "DELETE", true),
//   readAdListByText: new DocAPI("/ads", "GET", true),
//   readFavouriteAdList: new DocAPI("/favourites", "GET", true),
// };

// app.get("/api/ads/:primaryKeyAd", function(req: Request, res: Response){
//     const idAd = req.params.primaryKeyAd

//     //path dinamico: usare i :nomechiave, nome della variaible in cui verrà salvata quella richiesta, poi si recupera dall'oggetto params dentro la richiesta
// })

// routerApi.use("/", )
// routerApi.use("", )
// routerApi.use("", )
// routerApi.use("", )
// routerApi.use("", )

//per inizializzarlo
// app.use("/api", routerApi)

//root principale(endpoint), funzione da eseguire quando verrà chiamato l'endpoint che riceve request e response => ci permettono di intercettare la richiesta per capire che parametri ci hanno passato, la response per trovare dei metodi che ciservono per rispondere;

//primo parametro la porta, il secondo è la funzione da eseguire quando il server si mette in ascolto (callback)
