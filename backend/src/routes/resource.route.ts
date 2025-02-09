import express from 'express'
import { authorize, protect } from '../utils/auth.middleware'
import { createResource, getAllResources, getResourceById, getResourcesByDepartmentId, updateResource } from '../controllers/resource.controller'


const router = express.Router()


router.post('/createResource',protect,authorize(['HOD','ADMIN','PROFESSOR','LAB_ASSISTANT']),createResource)
router.patch('/updateResource',protect,authorize(['HOD','ADMIN','PROFESSOR','LAB_ASSISTANT']),updateResource)
router.get('/resources/:departmentId',protect,authorize(['HOD','ADMIN','PROFESSOR','LAB_ASSISTANT']),getResourcesByDepartmentId)
router.get('/resources',protect,authorize(['HOD','ADMIN','PROFESSOR','LAB_ASSISTANT','STUDENT']),getAllResources)
router.get('/resource/:resourceId',protect,getResourceById)





export default router