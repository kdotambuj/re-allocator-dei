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
exports.getTicketsByUserId = exports.getTicketsByHodId = exports.getDailyAvailability = exports.getTicketById = exports.getAllTickets = exports.createTicket = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createTicketSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(), // Ensures a valid cuid string
    departmentId: zod_1.z.number().int("Should be a number").positive(), // Ensures a positive integer
    requestedQuantity: zod_1.z.number().int("Should be a number").positive(), // Ensures a positive integer
    startTime: zod_1.z.coerce.date(), // Ensures a valid date
    endTime: zod_1.z.coerce.date()
});
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const parsed = createTicketSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }
        const { resourceId } = req.params;
        const { userId, departmentId, requestedQuantity, startTime, endTime } = parsed.data;
        // Check if the resource exists and is available
        const resource = yield prisma.resource.findUnique({
            where: { id: resourceId },
        });
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }
        if (!resource.available) {
            return res.status(400).json({ success: false, message: "Resource is currently unavailable" });
        }
        if (resource.quantity < requestedQuantity) {
            return res.status(400).json({ success: false, message: "Not enough resource quantity available" });
        }
        // Create a new ticket
        const ticket = yield prisma.ticket.create({
            data: {
                userId,
                resourceId,
                departmentId,
                requestedQuantity,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status: "PENDING",
            },
        });
        return res.status(201).json({ success: true, ticket, message: "Ticket created successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createTicket = createTicket;
const getAllTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield prisma.ticket.findMany({
            include: {
                resource: true,
                user: true
            }
        });
        return res.status(200).json({ success: true, tickets });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllTickets = getAllTickets;
const getTicketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        const ticket = yield prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        });
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        return res.status(200).json({ success: true, ticket });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTicketById = getTicketById;
const getDailyAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resourceId, date } = req.params; // Expect date in YYYY-MM-DD format
        const selectedDate = new Date(date);
        // Fetch approved tickets for the given day
        const tickets = yield prisma.ticket.findMany({
            where: {
                resourceId,
                status: "APPROVED",
                startTime: { gte: selectedDate, lt: new Date(selectedDate.getTime() + 86400000) }, // Get tickets on that day
            },
            select: { startTime: true, endTime: true, requestedQuantity: true },
        });
        // Get total resource quantity
        const resource = yield prisma.resource.findUnique({
            where: { id: resourceId },
            select: { quantity: true },
        });
        if (!resource)
            return res.status(404).json({ success: false, message: "Resource not found" });
        // Generate time slots (e.g., every hour from 00:00 to 23:59)
        const timeSlots = {};
        for (let hour = 0; hour < 24; hour++) {
            const formattedHour = hour.toString().padStart(2, '0');
            const nextHour = (hour + 1).toString().padStart(2, '0');
            const timeKey = `${formattedHour}:00 - ${nextHour}:00`;
            timeSlots[timeKey] = resource.quantity; // Default availability
        }
        // Adjust availability based on bookings
        tickets.forEach(ticket => {
            const startHour = ticket.startTime.getHours();
            const endHour = ticket.endTime.getHours();
            for (let hour = startHour; hour < endHour; hour++) {
                const timeKey = `${hour}:00 - ${hour + 1}:00`;
                timeSlots[timeKey] -= ticket.requestedQuantity; // Reduce available count
            }
        });
        return res.status(200).json({ success: true, availability: timeSlots });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getDailyAvailability = getDailyAvailability;
const getTicketsByHodId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hodId } = req.params;
        const tickets = yield prisma.ticket.findMany({
            where: {
                department: {
                    hodId
                }
            },
            include: {
                resource: true,
                user: true
            }
        });
        return res.status(200).json({ success: true, tickets });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTicketsByHodId = getTicketsByHodId;
const getTicketsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const tickets = yield prisma.ticket.findMany({
            where: {
                userId
            },
            include: {
                resource: true,
                user: true
            }
        });
        return res.status(201).json({ success: true, tickets });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTicketsByUserId = getTicketsByUserId;
