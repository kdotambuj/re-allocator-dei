"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var router = express_1.default.Router();
router.post('/signin', auth_controller_1.signin);
exports.default = router;
