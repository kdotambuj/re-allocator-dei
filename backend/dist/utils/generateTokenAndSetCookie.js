"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenAndSetCookie = (user, res) => {
    const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
    if (JWT_SECRET === "default-secret-key" && process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET environment variable is not set!");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '24h',
    });
    const { password } = user, userWithoutSensitiveData = __rest(user, ["password"]);
    // HTTP-only cookie
    res
        .cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: false, // Prevent XSS attacks
        sameSite: 'strict', // Prevent CSRF attacks
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    })
        .status(200)
        .json({
        success: true,
        data: {
            user: userWithoutSensitiveData,
            token,
        },
        message: "Signed in successfully",
    });
};
exports.default = generateTokenAndSetCookie;
