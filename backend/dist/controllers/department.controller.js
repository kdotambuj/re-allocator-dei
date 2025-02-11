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
exports.getDepartmentById = exports.getAllDepartments = exports.createDepartment = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createDepartmentSchema = zod_1.z.object({
    id: zod_1.z.number().int("Number only").positive(),
    name: zod_1.z.string().nonempty("Name must be there"),
    hodId: zod_1.z.string().nonempty("HodId must be there")
});
const prisma = new client_1.PrismaClient();
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = createDepartmentSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }
        const { id, name, hodId } = parsed.data;
        const existingDepartment = yield prisma.department.findUnique({
            where: { hodId }
        });
        if (existingDepartment) {
            return res.status(400).json({ success: false, message: "Department already exists with this hodId" });
        }
        const newDepartment = yield prisma.department.create({
            data: {
                id,
                name,
                hodId
            },
            select: {
                id: true,
                name: true,
                hodId: true,
                createdAt: true
            }
        });
        return res.status(201).json({ success: true, data: newDepartment, message: "Department created successfully" });
    }
    catch (error) {
        console.error("Error in signin controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.createDepartment = createDepartment;
const getAllDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield prisma.department.findMany({
            include: {
                hod: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!departments) {
            return res.status(404).json({ success: false, message: "No departments found" });
        }
        return res.status(200).json({ success: true, data: departments });
    }
    catch (error) {
        console.error("Error in getAllDepartments:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllDepartments = getAllDepartments;
const getDepartmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const department = yield prisma.department.findUnique({
            where: { id: Number(id) },
            include: {
                hod: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }
        return res.status(200).json({ success: true, data: department });
    }
    catch (error) {
        console.error("Error in getDepartmentById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getDepartmentById = getDepartmentById;
