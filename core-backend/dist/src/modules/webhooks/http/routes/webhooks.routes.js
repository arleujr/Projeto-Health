"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhooksRouter = webhooksRouter;
const bullmq_1 = require("bullmq");
const zod_1 = require("zod");
const connection_js_1 = require("../../../../shared/infra/queue/connection.js");
const whatsappQueue = new bullmq_1.Queue('WhatsAppIncoming', { connection: connection_js_1.queueConnection });
async function webhooksRouter(fastify) {
    fastify.post('/whatsapp', async (request, reply) => {
        const whatsappWebhookSchema = zod_1.z.object({
            messageId: zod_1.z.string(),
            sender: zod_1.z.string(),
            payload: zod_1.z.record(zod_1.z.any()),
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
//# sourceMappingURL=webhooks.routes.js.map