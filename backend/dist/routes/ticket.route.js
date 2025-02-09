"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../utils/auth.middleware");
const ticket_controller_1 = require("../controllers/ticket.controller");
const router = express_1.default.Router();
router.post('/createTicket/:resourceId', auth_middleware_1.protect, ticket_controller_1.createTicket);
router.get('/ticket/:ticketId', auth_middleware_1.protect, ticket_controller_1.getTicketById);
router.get('/tickets', auth_middleware_1.protect, ticket_controller_1.getAllTickets);
router.get('/availability/:resourceId/:date', auth_middleware_1.protect, ticket_controller_1.getDailyAvailability);
router.get('/tickets/:hodId', auth_middleware_1.protect, ticket_controller_1.getTicketsByHodId);
router.get('/user-tickets/:userId', auth_middleware_1.protect, ticket_controller_1.getTicketsByUserId);
exports.default = router;
