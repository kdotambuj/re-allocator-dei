"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../utils/auth.middleware");
const router = express_1.default.Router();
router.post('/createUser', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN']), user_controller_1.createUser);
router.get('/getAllUsers', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN']), user_controller_1.getAllUsers);
router.put('/updateUser', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['HOD', 'ADMIN']), user_controller_1.updateUserDepartmentId);
exports.default = router;
