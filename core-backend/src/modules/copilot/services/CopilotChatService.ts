import OpenAI from 'openai';
import { prisma } from '../../../shared/prisma/client.js';
import { AppError } from '../../../shared/errors/AppError.js';
interface IRequest {
  message: string;
  userRole: string;
  userName: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class CopilotChatService {
  public async execute({ message, userRole, userName }: IRequest): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new AppError("A chave da OpenAI não foi configurada no arquivo .env");
    }

    const systemPrompt = `
      Você é o Copiloto da plataforma HealthCore. 
      Você está falando com ${userName}, cujo cargo é ${userRole}.
      Seja direto, profissional, mas amigável. Responda em português.
      Você tem acesso a funções do sistema. Use-as quando o usuário pedir dados reais do banco.
    `;

    const tools = [
      {
        type: "function",
        function: {
          name: "get_active_patients_count",
          description: "Busca a quantidade total de pacientes ativos no banco de dados.",
          parameters: { type: "object", properties: {}, required: [] },
        },
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      tools: tools as any,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    // Se a IA decidir que precisa ler o banco usando o seu Prisma Client
    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      let functionResult = "";

      if (functionName === "get_active_patients_count") {
        // 🟢 CONSULTA REAL NO SEU BANCO DE DADOS
        // Ajuste o termo 'user' abaixo caso sua tabela de pacientes tenha outro nome no schema.prisma (ex: 'patient')
        const count = await prisma.user.count({
          where: {
            status: 'ACTIVE',
          },
        });
        functionResult = `Atualmente existem ${count} pacientes ativos cadastrados no sistema.`;
      }

      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
          responseMessage,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: functionResult,
          }
        ],
      });

      return secondResponse.choices[0].message.content || "Não consegui processar o retorno do banco.";
    }

    return responseMessage.content || "Sem resposta da IA.";
  }
}