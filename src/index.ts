import express, { Request, Response } from "express";
import { routerUsers } from "./routers/users";
import { Marketplace } from "./app";

const app = express(); //crea un'app express
const server = express.json(); //per istanziarlo formattare i dati che vengono passati dal client al server
const routerApi = express.Router();
const marketplace = new Marketplace() //istanziare la classe
app.use(server);
routerApi.use("/users", routerUsers)

app.get("/api/ads", function(req: Request, res: Response){ 
const adList = marketplace.readAdList();
return res.json(adList)
})

app.post("/api/auth/register", function(req: Request, res: Response){ 
 const email = req.body.email; //dentro il body ci sono due chiavi che servono come parametri
 const password = req.body.password;
 if (!email) return res.status(400).json({message: "Email not found"})
    if (!password) return res.status(400).json({message: "Password not found"})
 const registered = marketplace.register(email, password);
 if (registered) return res.status(200).json({message: "Succesfully registered"})
else 
 return res.status(400).json({message: "Already registered"});

})



app.post("/api/auth/login", function(req: Request, res: Response) { 
    const username = req.body.username;
    const password = req.body.password;
    const deviceName = req.body.deviceName;
    const authenticated = marketplace.login(username, password, deviceName);
    if (!!authenticated) return res.status(200).json({token: authenticated})
        else return res.status(400).json({message: "Unfound user"})
})


app.post("/api/auth/logout", function(req: Request, res: Response) { 
    const token = req.headers.authorization;
    const logged = marketplace.logout(Number(token));
    
    if (logged) return res.status(200).json({message: "Succesfully logged out"})
        else return res.status(400).json({message: "User not logged in"})
})

app.listen(3000, () => { 
    console.log("server http://localhost:3000")
});
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

// app.get("/", (req: Request, res: Response) => { 
//    return res.status(200).sendFile(__dirname + "./index.html")
// });


//root principale(endpoint), funzione da eseguire quando verrà chiamato l'endpoint che riceve request e response => ci permettono di intercettare la richiesta per capire che parametri ci hanno passato, la response per trovare dei metodi che ciservono per rispondere; 



//primo parametro la porta, il secondo è la funzione da eseguire quando il server si mette in ascolto (callback)