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
exports.getResourcesByDepartmentId = exports.updateResource = exports.getAllResources = exports.getResourceById = exports.createResource = void 0;
var client_1 = require("@prisma/client");
var zod_1 = require("zod");
var prisma = new client_1.PrismaClient();
var createResourceSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty("Name must be there"),
    description: zod_1.z.string().nonempty("Description must be there"),
    type: zod_1.z.string().nonempty("Type must be there"),
    departmentId: zod_1.z.number().int("Number only").positive(),
    quantity: zod_1.z.number().int("Number only").positive(),
    available: zod_1.z.boolean()
});
var updateResourceSchema = zod_1.z.object({
    id: zod_1.z.string().nonempty("Id must be there"),
    quantity: zod_1.z.number().int("Number only").positive(),
    available: zod_1.z.boolean()
});
var createResource = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, _a, name_1, description, type, departmentId, quantity, available, addedResource, existingResource, newResource, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                parsed = createResourceSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: parsed.error.errors })];
                }
                _a = parsed.data, name_1 = _a.name, description = _a.description, type = _a.type, departmentId = _a.departmentId, quantity = _a.quantity, available = _a.available;
                addedResource = { name: name_1, description: description, type: type, departmentId: departmentId, quantity: quantity, available: available };
                return [4 /*yield*/, prisma.resource.findUnique({
                        where: {
                            "department_resource": { name: name_1, departmentId: departmentId }
                        }
                    })];
            case 1:
                existingResource = _b.sent();
                if (existingResource) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Resource already exists with this name in this department" })];
                }
                return [4 /*yield*/, prisma.resource.create({
                        data: addedResource,
                        include: {
                            department: {
                                include: {
                                    hod: true
                                }
                            }
                        }
                    })];
            case 2:
                newResource = _b.sent();
                return [2 /*return*/, res.status(201).json({ success: true, data: newResource, message: "Resource created successfully" })];
            case 3:
                error_1 = _b.sent();
                console.error("Error in createResource:", error_1);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createResource = createResource;
var getResourceById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resourceId, resource, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                resourceId = req.params.resourceId;
                return [4 /*yield*/, prisma.resource.findUnique({
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
                    })];
            case 1:
                resource = _a.sent();
                if (!resource) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Resource not found" })];
                }
                return [2 /*return*/, res.status(200).json({ success: true, data: resource, message: "Resource fetched successfully" })];
            case 2:
                error_2 = _a.sent();
                console.error("Error in getResourceById:", error_2);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getResourceById = getResourceById;
var getAllResources = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resources, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.resource.findMany({
                        include: {
                            department: true
                        }
                    })];
            case 1:
                resources = _a.sent();
                if (!resources) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "No resources found" })];
                }
                return [2 /*return*/, res.status(200).json({ success: true, data: resources, message: "Resources fetched successfully" })];
            case 2:
                error_3 = _a.sent();
                console.error("Error in getAllResources:", error_3);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllResources = getAllResources;
var updateResource = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, _a, id, quantity, available, updatedResource, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                parsed = updateResourceSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: parsed.error.errors })];
                }
                _a = parsed.data, id = _a.id, quantity = _a.quantity, available = _a.available;
                return [4 /*yield*/, prisma.resource.update({
                        where: {
                            id: id
                        },
                        data: {
                            quantity: quantity,
                            available: available
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
                    })];
            case 1:
                updatedResource = _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, data: updatedResource, message: "Resource updated successfully" })];
            case 2:
                error_4 = _b.sent();
                console.error("Error in createResource:", error_4);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateResource = updateResource;
var getResourcesByDepartmentId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var departmentId, resources, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                departmentId = parseInt(req.params.departmentId);
                return [4 /*yield*/, prisma.resource.findMany({
                        where: {
                            departmentId: departmentId
                        },
                    })];
            case 1:
                resources = _a.sent();
                if (!resources) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "No resources found" })];
                }
                return [2 /*return*/, res.status(200).json({ success: true, data: resources, message: "Resources fetched successfully" })];
            case 2:
                error_5 = _a.sent();
                console.error("Error in getResourcesByDepartmentId:", error_5);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getResourcesByDepartmentId = getResourcesByDepartmentId;
