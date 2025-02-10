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
exports.updateUserDepartmentId = exports.getAllUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be atleast 2 characters long"),
    email: zod_1.z.string().email("Invalid Email Format").nonempty("Email must be there"),
    password: zod_1.z.string().min(6, "Password must be atleast 6 characters long"),
    role: zod_1.z.enum(["ADMIN", "STUDENT", "PROFESSOR", "LAB_ASSISTANT", "HOD"]),
    departmentId: zod_1.z.number().int("Number only").positive().optional()
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = createUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }
        const { name, email, password, role, departmentId } = parsed.data;
        const existingUser = yield prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                departmentId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                departmentId: true,
                createdAt: true,
            }
        });
        return res.status(201).json({ success: true, data: newUser, message: "User created successfully" });
    }
    catch (error) {
        console.error("Error in createUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            include: {
                department: true
            }
        });
        if (!users) {
            return res.status(404).json({ success: false, message: "No users found" });
        }
        return res.status(201).json({ success: true, data: users, message: "Users fetched successfully" });
    }
    catch (error) {
        console.error("Error in createUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllUsers = getAllUsers;
const updateUserDepartmentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, departmentId } = req.body;
        const updatedUser = yield prisma.user.update({
            where: {
                id: userId
            },
            data: {
                departmentId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                departmentId: true,
                createdAt: true
            }
        });
        return res.status(201).json({ success: true, data: updatedUser, message: "User updated successfully" });
    }
    catch (error) {
        console.error("Error in createUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateUserDepartmentId = updateUserDepartmentId;
