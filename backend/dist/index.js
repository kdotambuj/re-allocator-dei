"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_js_1 = __importDefault(require("./routes/user.route.js"));
const auth_route_js_1 = __importDefault(require("./routes/auth.route.js"));
const department_route_js_1 = __importDefault(require("./routes/department.route.js"));
const resource_route_js_1 = __importDefault(require("./routes/resource.route.js"));
const ticket_route_js_1 = __importDefault(require("./routes/ticket.route.js"));
const approval_route_js_1 = __importDefault(require("./routes/approval.route.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const corsOptions = {
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
app.use('/api/v1', user_route_js_1.default);
app.use('/api/v1', auth_route_js_1.default);
app.use('/api/v1', department_route_js_1.default);
app.use('/api/v1', resource_route_js_1.default);
app.use('/api/v1', ticket_route_js_1.default);
app.use('/api/v1', approval_route_js_1.default);
app.options("*", (0, cors_1.default)()); // Allow all OPTIONS preflight requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Backend Is Running');
});
