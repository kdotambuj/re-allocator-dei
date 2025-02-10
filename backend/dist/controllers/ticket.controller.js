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
const prisma = new client_1.PrismaClient();
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches 00:00 - 23:59
// const dateRegex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/; // Matches DD-MM-YYYY
// export const createTicketSchema = z.object({
//     userId: z.string().cuid(), // Ensures a valid cuid string
//     departmentId: z.number()
//         .int("Department ID should be a whole number")
//         .positive("Department ID must be positive"),
//     requestedQuantity: z.number()
//         .int("Requested quantity should be a whole number")
//         .positive("Requested quantity must be positive"),
//     startTime: z.string()
//         .regex(timeRegex, "Invalid start time format. Use HH:MM (24-hour format)"),
//     endTime: z.string()
//         .regex(timeRegex, "Invalid end time format. Use HH:MM (24-hour format)"),
//     date: z.string()
//         .regex(dateRegex, "Invalid date format. Use DD-MM-YYYY")
//         .refine((date) => {
//             const [day, month, year] = date.split("-").map(Number);
//             const parsedDate = new Date(year, month - 1, day);
//             return !isNaN(parsedDate.getTime()); // Ensures it's a real date
//         }, "Invalid calendar date"),
// }).refine(data => {
//     const [startHour, startMinute] = data.startTime.split(":").map(Number);
//     const [endHour, endMinute] = data.endTime.split(":").map(Number);
//     const startTotalMinutes = startHour * 60 + startMinute;
//     const endTotalMinutes = endHour * 60 + endMinute;
//     return startTotalMinutes < endTotalMinutes;
// }, {
//     message: "Start time must be before end time",
//     path: ["startTime"],
// });
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const parsed = createTicketSchema.safeParse(req.body);
        // if (!parsed.success) {
        //     return res.status(400).json({ success: false, error: parsed.error.errors });
        // }
        const { resourceId } = req.params;
        const { userId, departmentId, requestedQuantity, startTime, endTime, date } = req.body;
        // Check if the resource exists
        const resource = yield prisma.resource.findUnique({
            where: { id: resourceId },
        });
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }
        // Create the ticket without checking time slot availability
        var ticketToBeAdded = {
            userId,
            departmentId,
            requestedQuantity,
            startTime,
            endTime,
            date,
            resourceId
        };
        const ticket = yield prisma.ticket.create({
            data: ticketToBeAdded
        });
        return res.status(201).json({
            success: true,
            ticket,
            message: "Ticket created successfully"
        });
    }
    catch (error) {
        console.error("Error creating ticket:", error);
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
        const { resourceId, date } = req.params; // Expect date in DD-MM-YYYY format
        if (!resourceId || !date) {
            return res.status(400).json({ success: false, message: "Missing resourceId or date" });
        }
        // Validate date format (expecting DD-MM-YYYY)
        const dateParts = String(date).split("-");
        if (dateParts.length !== 3) {
            return res.status(400).json({ success: false, message: "Invalid date format. Use DD-MM-YYYY" });
        }
        const formattedDate = date; // Already stored in DD-MM-YYYY format
        const ticketQuery = {
            resourceId,
            date: formattedDate,
            status: client_1.TicketStatus.APPROVED
        };
        // Fetch approved tickets for the given day
        const tickets = yield prisma.ticket.findMany({
            where: ticketQuery,
            select: { startTime: true, endTime: true, requestedQuantity: true },
        });
        // Get total resource quantity
        const resource = yield prisma.resource.findUnique({
            where: { id: resourceId },
            select: { quantity: true },
        });
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }
        // Initialize time slots (hourly format: HH:00 - HH+1:00)
        const timeSlots = {};
        for (let hour = 0; hour < 24; hour++) {
            const timeKey = `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`;
            timeSlots[timeKey] = resource.quantity; // Default availability
        }
        // Adjust availability based on approved bookings
        tickets.forEach(ticket => {
            if (!ticket.startTime || !ticket.endTime)
                return;
            const startHour = parseInt(String(ticket.startTime).split(":")[0], 10);
            const startMinute = parseInt(String(ticket.startTime).split(":")[1], 10);
            const endHour = parseInt(String(ticket.endTime).split(":")[0], 10);
            const endMinute = parseInt(String(ticket.endTime).split(":")[1], 10);
            for (let hour = startHour; hour < endHour || (hour === endHour && endMinute > 0); hour++) {
                const timeKey = `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`;
                if (timeSlots[timeKey] !== undefined) {
                    timeSlots[timeKey] = Math.max(0, timeSlots[timeKey] - ticket.requestedQuantity); // Ensure no negative values
                }
            }
        });
        return res.status(200).json({ success: true, availability: timeSlots });
    }
    catch (error) {
        console.error("Error fetching availability:", error);
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
