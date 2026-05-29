import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../errors/AppError.js';

export function globalExceptionHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
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