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
exports.rejectTicket = exports.completeTicket = exports.approveTicket = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var approveTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, hodId, ticketId, ticket, department, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.params, hodId = _a.hodId, ticketId = _a.ticketId;
                return [4 /*yield*/, prisma.ticket.findUnique({
                        where: { id: ticketId },
                        include: { resource: true, department: true }
                    })];
            case 1:
                ticket = _b.sent();
                if (!ticket) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Ticket not found" })];
                }
                // Check if the ticket is already approved/rejected
                if (ticket.status !== "PENDING") {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Ticket is already processed" })];
                }
                return [4 /*yield*/, prisma.department.findUnique({
                        where: { id: ticket.departmentId },
                    })];
            case 2:
                department = _b.sent();
                if (!department || department.hodId !== hodId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: "You are not authorized to approve this ticket" })];
                }
                // Check if enough resources are available
                if (ticket.resource.quantity < ticket.requestedQuantity) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Not enough resources available" })];
                }
                // Approve the ticket and update resource quantity
                return [4 /*yield*/, prisma.$transaction([
                        prisma.ticket.update({
                            where: { id: ticketId },
                            data: { status: "APPROVED" },
                        }),
                        prisma.approval.create({
                            data: {
                                ticketId: ticketId,
                                hodId: hodId,
                                status: "APPROVED",
                            },
                        }),
                    ])];
            case 3:
                // Approve the ticket and update resource quantity
                _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Ticket approved successfully" })];
            case 4:
                error_1 = _b.sent();
                console.log(error_1);
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.approveTicket = approveTicket;
var completeTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, ticket, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ticketId = req.params.ticketId;
                return [4 /*yield*/, prisma.ticket.findUnique({
                        where: { id: ticketId },
                    })];
            case 1:
                ticket = _a.sent();
                if (!ticket) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Ticket not found" })];
                }
                if (ticket.status !== "APPROVED") {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Ticket is not approved" })];
                }
                return [4 /*yield*/, prisma.ticket.update({
                        where: { id: ticketId },
                        data: { status: "COMPLETED" },
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Ticket completed successfully" })];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.completeTicket = completeTicket;
var rejectTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, ticket, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ticketId = req.params.ticketId;
                return [4 /*yield*/, prisma.ticket.findUnique({
                        where: { id: ticketId },
                    })];
            case 1:
                ticket = _a.sent();
                if (!ticket) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Ticket not found" })];
                }
                if (ticket.status !== "PENDING") {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Ticket is already processed" })];
                }
                return [4 /*yield*/, prisma.ticket.update({
                        where: { id: ticketId },
                        data: { status: "REJECTED" },
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Ticket rejected successfully" })];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                res.status(500).json({ success: false, message: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.rejectTicket = rejectTicket;
