import { FastifyInstance } from 'fastify';
import { Queue } from 'bullmq';
import { z } from 'zod';
import { queueConnection } from '../../../../shared/infra/queue/connection.js';

const whatsappQueue = new Queue('WhatsAppIncoming', { connection: queueConnection });

export async function webhooksRouter(fastify: FastifyInstance) {
  fastify.post('/whatsapp', async (request, reply) => {
    const whatsappWebhookSchema = z.object({
      messageId: z.string(),
      sender: z.string(),
      payload: z.record(z.any()),
    });

    const validatedData = whatsappWebhookSchema.parse(request.body);

    // Push heavy background task into BullMQ Redis cluster line
    await whatsappQueue.add('process_message', {
      id: validatedData.messageId,
      phone: validatedData.sender,
      data: validatedData.payload,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });

    // Blazing-fast acknowledgment back to Meta Servers (Sub 20ms response loop)
    return reply.status(200).send({ received: true });
  });
}