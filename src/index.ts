import express, { Request, Response } from "express";
// import { routerUsers } from "./routers/users";
import { Marketplace } from "./app";
const marketplace = new Marketplace(); //istanziare la classe

const app = express(); //crea un'app express
const server = express.json(); //per istanziarlo formattare i dati che vengono passati dal client al server
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
  const logged = marketplace.logout(Number(token));

  if (logged)
    return res.status(200).json({ message: "Succesfully logged out" });
  else return res.status(400).json({ message: "User not logged in" });
});

app.post("/api/ads", function (req: Request, res: Response) {
  const ad = req.body;
  console.log(ad);
  const created = marketplace.createAd(
    Number(req.headers.authorization),
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

// app.get("/devices/:primaryKeyDevice"),
//   function (req: Request, res: Response) {
//     const token = req.headers.authorization;
//     const device = marketplace.readDevice(req.params.deviceName, Number(token));

//     if (device) return res.status(200).json(device);
//     else return res.status(400).json({ message: "Device not found" });
//   };

app.post("/api/reports", function (req: Request, res: Response) {
  const report = req.body;
  const created = marketplace.createReport(
    report.token,
    report.referenceKeyAd,
    report.description,
    report.status
  );
  if (created) return res.status(200).json(created);
  else return res.status(400).json({ message: "Report not created" });
});

app.get("/api/users", function (req: Request, res: Response) {
  const userList = marketplace.readUserList();
  return res.json(userList);
});

app.put("/api/ads/:primaryKeyAd", function (req: Request, res: Response) {
  const ad = req.body;
  const updated = marketplace.updateAd(
    Number(req.params.primaryKeyAd),
    Number(req.headers.authorization),
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

app.listen(3000, () => {
  console.log("server http://localhost:3000");
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
