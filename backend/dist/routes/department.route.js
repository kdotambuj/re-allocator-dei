"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../utils/auth.middleware");
const department_controller_1 = require("../controllers/department.controller");
const router = express_1.default.Router();
router.post('/createDepartment', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN']), department_controller_1.createDepartment);
router.get('/departments', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN']), department_controller_1.getAllDepartments);
router.get('/department/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN']), department_controller_1.getDepartmentById);
exports.default = router;
