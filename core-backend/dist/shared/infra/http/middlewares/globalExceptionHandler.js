import { ZodError } from 'zod';
import { AppError } from '../../../errors/AppError.js';
export function globalExceptionHandler(error, _request, reply) {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            status: 'error',
            message: error.message,
        });
    }
    if (error instanceof ZodError) {
        return reply.status(400).send({
            status: 'validation_error',
            message: 'Invalid input data.',
            issues: error.format(),
        });
    }
    return reply.status(500).send({
        status: 'error',
        message: 'Internal server error.',
    });
}
