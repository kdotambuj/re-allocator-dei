import express,{ Router } from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";
import { protect, authorize } from "../utils/auth.middleware";


const router:Router = express.Router()

router.post('/createUser',protect,authorize(['HOD','ADMIN']),createUser)
router.get('/getAllUsers',protect,authorize(['HOD','ADMIN']),getAllUsers)


export default router;
