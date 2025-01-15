import express,{ Router } from "express";
import { createUser } from "../controllers/user.controller";


const router:Router = express.Router()

router.post('/createUser',createUser)


export default router;
