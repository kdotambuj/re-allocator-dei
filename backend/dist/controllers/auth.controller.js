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
exports.signin = void 0;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const generateTokenAndSetCookie_1 = __importDefault(require("../utils/generateTokenAndSetCookie"));
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
const prisma = new client_1.PrismaClient();
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = signinSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }
        const { email, password } = parsed.data;
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        return (0, generateTokenAndSetCookie_1.default)(user, res);
    }
    catch (error) {
        console.error("Error in signin controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.signin = signin;
