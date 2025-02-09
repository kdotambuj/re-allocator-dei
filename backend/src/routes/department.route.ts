import express from 'express'
import { authorize, protect } from '../utils/auth.middleware'
import { createDepartment, getAllDepartments, getDepartmentById } from '../controllers/department.controller'


const router = express.Router()



router.post('/createDepartment',protect,authorize(['HOD','ADMIN']),createDepartment)
router.get('/departments',protect,authorize(['HOD','ADMIN']),getAllDepartments)
router.get('/department/:id',protect,authorize(['HOD','ADMIN']),getDepartmentById)








export default router

