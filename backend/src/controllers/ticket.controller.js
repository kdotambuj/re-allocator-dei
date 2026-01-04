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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketsByUserId = exports.getTicketsByHodId = exports.getDailyAvailability = exports.getTicketById = exports.getAllTickets = exports.createTicket = exports.createTicketSchema = void 0;
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var prisma = new client_1.PrismaClient();
var timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches 00:00 - 23:59
var dateRegex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/; // Matches DD-MM-YYYY
exports.createTicketSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(), // Ensures a valid cuid string
    departmentId: zod_1.z.number()
        .int("Department ID should be a whole number")
        .positive("Department ID must be positive"),
    requestedQuantity: zod_1.z.number()
        .int("Requested quantity should be a whole number")
        .positive("Requested quantity must be positive"),
    startTime: zod_1.z.string()
        .regex(timeRegex, "Invalid start time format. Use HH:MM (24-hour format)"),
    endTime: zod_1.z.string()
        .regex(timeRegex, "Invalid end time format. Use HH:MM (24-hour format)"),
    dateRequested: zod_1.z.string()
        .regex(dateRegex, "Invalid date format. Use DD-MM-YYYY")
        .refine(function (date) {
        var _a = date.split("-").map(Number), day = _a[0], month = _a[1], year = _a[2];
        var parsedDate = new Date(year, month - 1, day);
        return !isNaN(parsedDate.getTime()); // Ensures it's a real date
    }, "Invalid calendar date"),
}).refine(function (data) {
    var _a = data.startTime.split(":").map(Number), startHour = _a[0], startMinute = _a[1];
    var _b = data.endTime.split(":").map(Number), endHour = _b[0], endMinute = _b[1];
    var startTotalMinutes = startHour * 60 + startMinute;
    var endTotalMinutes = endHour * 60 + endMinute;
    return startTotalMinutes < endTotalMinutes;
}, {
    message: "Start time must be before end time",
    path: ["startTime"],
});
var createTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, resourceId, _a, userId, departmentId, requestedQuantity, startTime, endTime, dateRequested, resource, ticketToBeAdded, ticket, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                parsed = exports.createTicketSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: parsed.error.errors })];
                }
                resourceId = req.params.resourceId;
                _a = parsed.data, userId = _a.userId, departmentId = _a.departmentId, requestedQuantity = _a.requestedQuantity, startTime = _a.startTime, endTime = _a.endTime, dateRequested = _a.dateRequested;
                return [4 /*yield*/, prisma.resource.findUnique({
                        where: { id: resourceId },
                    })];
            case 1:
                resource = _b.sent();
                if (!resource) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Resource not found" })];
                }
                ticketToBeAdded = {
                    userId: userId,
                    departmentId: departmentId,
                    requestedQuantity: requestedQuantity,
                    startTime: startTime,
                    endTime: endTime,
                    dateRequested: dateRequested,
                    resourceId: resourceId
                };
                return [4 /*yield*/, prisma.ticket.create({
                        data: ticketToBeAdded
                    })];
            case 2:
                ticket = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        success: true,
                        ticket: ticket,
                        message: "Ticket created successfully"
                    })];
            case 3:
                error_1 = _b.sent();
                console.error("Error creating ticket:", error_1);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createTicket = createTicket;
var getAllTickets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tickets, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.ticket.findMany({
                        include: {
                            resource: true,
                            user: true
                        }
                    })];
            case 1:
                tickets = _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, tickets: tickets })];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllTickets = getAllTickets;
var getTicketById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, ticket, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ticketId = req.params.ticketId;
                return [4 /*yield*/, prisma.ticket.findUnique({
                        where: {
                            id: ticketId
                        }
                    })];
            case 1:
                ticket = _a.sent();
                if (!ticket) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Ticket not found" })];
                }
                return [2 /*return*/, res.status(200).json({ success: true, ticket: ticket })];
            case 2:
                error_3 = _a.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTicketById = getTicketById;
var getDailyAvailability = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, resourceId, date, dateParts, formattedDate, ticketQuery, tickets, resource, timeSlots_1, hour, timeKey, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, resourceId = _a.resourceId, date = _a.date;
                if (!resourceId || !date) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Missing resourceId or date" })];
                }
                dateParts = String(date).split("-");
                if (dateParts.length !== 3) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Invalid date format. Use DD-MM-YYYY" })];
                }
                formattedDate = date;
                ticketQuery = {
                    resourceId: resourceId,
                    dateRequested: formattedDate,
                    status: client_1.TicketStatus.APPROVED
                };
                return [4 /*yield*/, prisma.ticket.findMany({
                        where: ticketQuery,
                        select: { startTime: true, endTime: true, requestedQuantity: true },
                    })];
            case 1:
                tickets = _b.sent();
                return [4 /*yield*/, prisma.resource.findUnique({
                        where: { id: resourceId },
                        select: { quantity: true },
                    })];
            case 2:
                resource = _b.sent();
                if (!resource) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Resource not found" })];
                }
                timeSlots_1 = {};
                for (hour = 0; hour < 24; hour++) {
                    timeKey = "".concat(hour.toString().padStart(2, "0"), ":00 - ").concat((hour + 1).toString().padStart(2, "0"), ":00");
                    timeSlots_1[timeKey] = resource.quantity; // Default availability
                }
                // Adjust availability based on approved bookings
                tickets.forEach(function (ticket) {
                    if (!ticket.startTime || !ticket.endTime)
                        return;
                    var startHour = parseInt(String(ticket.startTime).split(":")[0], 10);
                    var startMinute = parseInt(String(ticket.startTime).split(":")[1], 10);
                    var endHour = parseInt(String(ticket.endTime).split(":")[0], 10);
                    var endMinute = parseInt(String(ticket.endTime).split(":")[1], 10);
                    for (var hour = startHour; hour < endHour || (hour === endHour && endMinute > 0); hour++) {
                        var timeKey = "".concat(hour.toString().padStart(2, "0"), ":00 - ").concat((hour + 1).toString().padStart(2, "0"), ":00");
                        if (timeSlots_1[timeKey] !== undefined) {
                            timeSlots_1[timeKey] = Math.max(0, timeSlots_1[timeKey] - ticket.requestedQuantity); // Ensure no negative values
                        }
                    }
                });
                return [2 /*return*/, res.status(200).json({ success: true, availability: timeSlots_1 })];
            case 3:
                error_4 = _b.sent();
                console.error("Error fetching availability:", error_4);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getDailyAvailability = getDailyAvailability;
var getTicketsByHodId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hodId, tickets, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                hodId = req.params.hodId;
                return [4 /*yield*/, prisma.ticket.findMany({
                        where: {
                            department: {
                                hodId: hodId
                            }
                        },
                        include: {
                            resource: true,
                            user: true
                        }
                    })];
            case 1:
                tickets = _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, tickets: tickets })];
            case 2:
                error_5 = _a.sent();
                console.error(error_5);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTicketsByHodId = getTicketsByHodId;
var getTicketsByUserId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, tickets, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, prisma.ticket.findMany({
                        where: {
                            userId: userId
                        },
                        include: {
                            resource: true,
                            user: true
                        }
                    })];
            case 1:
                tickets = _a.sent();
                return [2 /*return*/, res.status(201).json({ success: true, tickets: tickets })];
            case 2:
                error_6 = _a.sent();
                console.error(error_6);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTicketsByUserId = getTicketsByUserId;
