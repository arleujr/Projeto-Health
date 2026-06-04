import 'dotenv/config';
import Fastify from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../../errors/AppError.js'; // Custom business error
import { app } from './app.js';
const PORT = Number(process.env.PORT) || 3333;
// Initialize Fastify instance
const server = Fastify();
// Global error handler
server.setErrorHandler((error, request, reply) => {
    // 1. Capture Zod validation errors
    if (error instanceof ZodError) {
        return reply.status(400).send({
            status: 'error',
            message: 'Validation error.',
            issues: error.format(),
        });
    }
    // 2. Capture known Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation
        if (error.code === 'P2002') {
            return reply.status(409).send({
                status: 'error',
                message: `Data conflict: The value for field [${error.meta?.target?.join(', ')}] is already in use.`,
            });
        }
        // P2025: Record not found
        if (error.code === 'P2025') {
            return reply.status(404).send({
                status: 'error',
                message: 'Operation aborted: One of the related records was not found in the database.',
            });
        }
    }
    // 3. Capture Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
        return reply.status(400).send({
            status: 'error',
            message: 'Persistence structure error. Check if all required fields were provided.',
        });
    }
    // 4. Capture custom business logic errors
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            status: 'error',
            message: error.message,
        });
    }
    // 5. Fallback for unknown critical errors
    request.log.error(error); // Log internally for debugging
    return reply.status(500).send({
        status: 'error',
        message: 'Internal server error.',
    });
});
const start = async () => {
    try {
        console.log('⏳ Attempting to start Fastify...');
        // Listen on 0.0.0.0 for external connections
        await app.listen({
            port: PORT,
            host: '0.0.0.0',
        });
        console.log(`\n============= HEALTH TECH CORE-BACKEND =============`);
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`🎯 Onboarding, Login and Anamnesis routes ready!`);
        console.log(`====================================================\n`);
    }
    catch (err) {
        console.log(`\n❌ [CRITICAL STARTUP ERROR]:`);
        console.error(err.message || err);
        console.log(`====================================================\n`);
        process.exit(1);
    }
};
// Capture unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    console.error('\n🚨 Unhandled Rejection:', reason);
});
start();
