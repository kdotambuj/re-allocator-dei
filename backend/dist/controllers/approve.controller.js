"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectTicket = exports.completeTicket = exports.approveTicket = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const approveTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hodId, ticketId } = req.params;
        // Find the ticket
        const ticket = yield prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { resource: true, department: true }
        });
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        // Check if the ticket is already approved/rejected
        if (ticket.status !== "PENDING") {
            return res.status(400).json({ success: false, message: "Ticket is already processed" });
        }
        // Ensure HOD belongs to the correct department
        const department = yield prisma.department.findUnique({
            where: { id: ticket.departmentId },
        });
        if (!department || department.hodId !== hodId) {
            return res.status(403).json({ success: false, message: "You are not authorized to approve this ticket" });
        }
        // Check if enough resources are available
        if (ticket.resource.quantity < ticket.requestedQuantity) {
            return res.status(400).json({ success: false, message: "Not enough resources available" });
        }
        // Approve the ticket and update resource quantity
        yield prisma.$transaction([
            prisma.ticket.update({
                where: { id: ticketId },
                data: { status: "APPROVED" },
            }),
            prisma.approval.create({
                data: {
                    ticketId,
                    hodId,
                    status: "APPROVED",
                },
            }),
        ]);
        return res.status(200).json({ success: true, message: "Ticket approved successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.approveTicket = approveTicket;
const completeTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        const ticket = yield prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        if (ticket.status !== "APPROVED") {
            return res.status(400).json({ success: false, message: "Ticket is not approved" });
        }
        yield prisma.ticket.update({
            where: { id: ticketId },
            data: { status: "COMPLETED" },
        });
        return res.status(200).json({ success: true, message: "Ticket completed successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.completeTicket = completeTicket;
const rejectTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        const ticket = yield prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        if (ticket.status !== "PENDING") {
            return res.status(400).json({ success: false, message: "Ticket is already processed" });
        }
        yield prisma.ticket.update({
            where: { id: ticketId },
            data: { status: "REJECTED" },
        });
        return res.status(200).json({ success: true, message: "Ticket rejected successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.rejectTicket = rejectTicket;
