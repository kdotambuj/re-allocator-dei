import express, { Router } from 'express';
import { protect } from '../utils/auth.middleware';
import { createTicket, getAllTickets, getDailyAvailability, getTicketById,getTicketsByHodId, getTicketsByUserId } from '../controllers/ticket.controller';



const router:Router = express.Router();


router.post('/createTicket/:resourceId',protect,createTicket)
router.get('/ticket/:ticketId',protect,getTicketById)
router.get('/tickets',protect,getAllTickets)
router.get('/availability/:resourceId/:date',protect,getDailyAvailability)
router.get('/tickets/:hodId',protect,getTicketsByHodId)
router.get('/user-tickets/:userId',protect,getTicketsByUserId)




export default router;