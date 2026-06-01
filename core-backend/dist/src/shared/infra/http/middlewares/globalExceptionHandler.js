"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalExceptionHandler = globalExceptionHandler;
const zod_1 = require("zod");
const AppError_js_1 = require("../../../errors/AppError.js");
function globalExceptionHandler(error, _request, response, _next) {
    if (error instanceof AppError_js_1.AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }
    if (error instanceof zod_1.ZodError) {
        return response.status(400).json({
            status: 'validation_error',
            message: 'Invalid input data.',
            issues: error.format(),
        });
    }
    console.error('[InternalServerError]:', error);
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error.',
    });
}
