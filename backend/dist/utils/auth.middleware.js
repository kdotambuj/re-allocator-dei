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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
        if (JWT_SECRET === "default-secret-key" && process.env.NODE_ENV === "production") {
            throw new Error("JWT_SECRET environment variable is not set!");
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return next(new Error('User not found'));
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        next(new Error('Invalid token'));
    }
});
exports.protect = protect;
// Role authorization middleware
const authorize = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !roles.includes(req.user.role)) {
                return next(new Error('Not authorized to access this route'));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
