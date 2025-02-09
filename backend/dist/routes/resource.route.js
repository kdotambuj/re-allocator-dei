"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../utils/auth.middleware");
const resource_controller_1 = require("../controllers/resource.controller");
const router = express_1.default.Router();
router.post('/createResource', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN', 'PROFESSOR', 'LAB_ASSISTANT']), resource_controller_1.createResource);
router.patch('/updateResource', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN', 'PROFESSOR', 'LAB_ASSISTANT']), resource_controller_1.updateResource);
router.get('/resources/:departmentId', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN', 'PROFESSOR', 'LAB_ASSISTANT']), resource_controller_1.getResourcesByDepartmentId);
router.get('/resources', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN', 'PROFESSOR', 'LAB_ASSISTANT', 'STUDENT']), resource_controller_1.getAllResources);
router.get('/resource/:resourceId', auth_middleware_1.protect, resource_controller_1.getResourceById);
exports.default = router;
