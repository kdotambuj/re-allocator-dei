"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var body_parser_1 = require("body-parser");
var cookie_parser_1 = require("cookie-parser");
var user_route_1 = require("./routes/user.route");
var auth_route_1 = require("./routes/auth.route");
var department_route_1 = require("./routes/department.route");
var resource_route_1 = require("./routes/resource.route");
var ticket_route_1 = require("./routes/ticket.route");
var approval_route_1 = require("./routes/approval.route");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 8000;
var corsOptions = {
    origin: ['http://localhost:3000', 'https://re-allocator-dei.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// api routes
app.use('/api/v1', user_route_1.default);
app.use('/api/v1', auth_route_1.default);
app.use('/api/v1', department_route_1.default);
app.use('/api/v1', resource_route_1.default);
app.use('/api/v1', ticket_route_1.default);
app.use('/api/v1', approval_route_1.default);
app.options("*", (0, cors_1.default)()); // Allow all OPTIONS preflight requests
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
app.get('/', function (req, res) {
    res.send("\n        <html>\n            <head>\n                <title>Backend Status</title>\n                <style>\n                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }\n                    a { color: #007bff; text-decoration: none; font-size: 18px; }\n                    a:hover { text-decoration: underline; }\n                </style>\n            </head>\n            <body>\n                <h2>Backend is Running Successfully!</h2>\n                <p>You can visit the functional website here:</p>\n                <p><a href=\"https://re-allocator-dei.vercel.app\" target=\"_blank\">Re-Allocator Frontend</a></p>\n            </body>\n        </html>\n    ");
});
