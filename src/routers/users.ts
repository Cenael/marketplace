import express, {Request, Response} from "express";

export const routerUsers = express.Router()

routerUsers.get("/", function (req: Request, res: Response) { 
return res.status(200).json({ users: [] }); 
})