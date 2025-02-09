"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../utils/auth.middleware");
const approve_controller_1 = require("../controllers/approve.controller");
const router = express_1.default.Router();
router.post('/approve/:hodId/:ticketId', auth_middleware_1.protect, approve_controller_1.approveTicket);
router.post('/complete/:ticketId', auth_middleware_1.protect, approve_controller_1.completeTicket);
router.post('/reject/:ticketId', auth_middleware_1.protect, approve_controller_1.rejectTicket);
exports.default = router;
