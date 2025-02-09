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
exports.getResourcesByDepartmentId = exports.updateResource = exports.getAllResources = exports.getResourceById = exports.createResource = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createResourceSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty("Name must be there"),
    description: zod_1.z.string().nonempty("Description must be there"),
    type: zod_1.z.string().nonempty("Type must be there"),
    departmentId: zod_1.z.number().int("Number only").positive(),
    quantity: zod_1.z.number().int("Number only").positive(),
    available: zod_1.z.boolean()
});
const updateResourceSchema = zod_1.z.object({
    id: zod_1.z.string().nonempty("Id must be there"),
    quantity: zod_1.z.number().int("Number only").positive(),
    available: zod_1.z.boolean()
});
const createResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = createResourceSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }
        const { name, description, type, departmentId, quantity, available } = parsed.data;
        const addedResource = { name, description, type, departmentId, quantity, available };
        const existingResource = yield prisma.resource.findUnique({
            where: {
                "department_resource": { name, departmentId }
            }
        });
        if (existingResource) {
            return res.status(400).json({ success: false, message: "Resource already exists with this name in this department" });
        }
        const newResource = yield prisma.resource.create({
            data: addedResource,
            include: {
                department: {
                    include: {
                        hod: true
                    }
                }
            }
        });
        return res.status(201).json({ success: true, data: newResource, message: "Resource created successfully" });
    }
    catch (error) {
        console.error("Error in createResource:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createResource = createResource;
const getResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resourceId } = req.params;
        const resource = yield prisma.resource.findUnique({
            where: {
                id: resourceId
            },
            include: {
                department: {
                    include: {
                        hod: true
                    }
                }
            }
        });
        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }
        return res.status(200).json({ success: true, data: resource, message: "Resource fetched successfully" });
    }
    catch (error) {
        console.error("Error in getResourceById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getResourceById = getResourceById;
const getAllResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resources = yield prisma.resource.findMany({
            include: {
                department: true
            }
        });
        if (!resources) {
            return res.status(404).json({ success: false, message: "No resources found" });
        }
        return res.status(200).json({ success: true, data: resources, message: "Resources fetched successfully" });
    }
    catch (error) {
        console.error("Error in getAllResources:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllResources = getAllResources;
const updateResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = updateResourceSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }
        const { id, quantity, available } = parsed.data;
        const updatedResource = yield prisma.resource.update({
            where: {
                id
            },
            data: {
                quantity,
                available
            },
            select: {
                id: true,
                name: true,
                description: true,
                type: true,
                departmentId: true,
                quantity: true,
                available: true
            }
        });
        return res.status(200).json({ success: true, data: updatedResource, message: "Resource updated successfully" });
    }
    catch (error) {
        console.error("Error in createResource:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateResource = updateResource;
const getResourcesByDepartmentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departmentId = parseInt(req.params.departmentId);
        const resources = yield prisma.resource.findMany({
            where: {
                departmentId
            },
        });
        if (!resources) {
            return res.status(404).json({ success: false, message: "No resources found" });
        }
        return res.status(200).json({ success: true, data: resources, message: "Resources fetched successfully" });
    }
    catch (error) {
        console.error("Error in getResourcesByDepartmentId:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getResourcesByDepartmentId = getResourcesByDepartmentId;
