"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const zod_1 = require("zod");
const AppError_js_1 = require("../../errors/AppError.js");
const users_routes_js_1 = require("../../../modules/users/http/routes/users.routes.js");
const webhooks_routes_js_1 = require("../../../modules/webhooks/http/routes/webhooks.routes.js");
const app = (0, fastify_1.default)({
    logger: process.env.NODE_ENV === 'development',
});
exports.app = app;
// Register Domain Route Plugins
app.register(users_routes_js_1.usersRouter, { prefix: '/v1/users' });
app.register(webhooks_routes_js_1.webhooksRouter, { prefix: '/v1/webhooks' });
// Non-blocking Global Exception Handler
app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError_js_1.AppError) {
        return reply.status(error.statusCode).send({
            status: 'error',
            message: error.message,
        });
    }
    if (error instanceof zod_1.ZodError) {
        return reply.status(400).send({
            status: 'validation_error',
            message: 'Invalid input data.',
            issues: error.format(),
        });
    }
    app.log.error(error);
    return reply.status(500).send({
        status: 'error',
        message: 'Internal server error.',
    });
});
//# sourceMappingURL=app.js.map