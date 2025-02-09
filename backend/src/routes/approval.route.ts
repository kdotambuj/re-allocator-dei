import express, { Router } from 'express';
import { protect } from '../utils/auth.middleware';
import { createTicket, getTicketById } from '../controllers/ticket.controller';
import { approveTicket, completeTicket, rejectTicket } from '../controllers/approve.controller';



const router:Router = express.Router();


router.post('/approve/:hodId/:ticketId',protect,approveTicket)
router.post('/complete/:ticketId',protect,completeTicket)
router.post('/reject/:ticketId',protect,rejectTicket)




export default router