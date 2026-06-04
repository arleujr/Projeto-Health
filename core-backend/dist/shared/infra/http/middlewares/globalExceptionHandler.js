// 🚀 Corrigido: Removido o "shared" duplicado do caminho do import
import { AppError } from '../../../../shared/errors/AppError.js';
export async function globalExceptionHandler(error, request, reply) {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            status: 'error',
            message: error.message,
        });
    }
    // Mostra o erro real se algo grave quebrar no banco
    console.error('❌ ERRO INTERNO DETECTADO NO BACKEND:');
    console.error(error);
    return reply.status(500).send({
        status: 'error',
        message: 'Internal server error.',
    });
}
