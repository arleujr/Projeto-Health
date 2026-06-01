import 'dotenv/config';
import { app } from './app.js';

const PORT = Number(process.env.PORT) || 3333;

const start = async () => {
  try {
    console.log('⏳ Tentando dar a partida no Fastify...');
    
    // Escuta em 0.0.0.0 para conexões externas
    await app.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });
    
    console.log(`\n============= HEALTH TECH CORE-BACKEND =============`);
    console.log(`🚀 Servidor voando baixo em http://localhost:${PORT}`);
    console.log(`🎯 Rotas de Onboarding, Login e Anamnese Prontas!`);
    console.log(`====================================================\n`);
  } catch (err: any) {
    // 🚨 ESTE BLOCO VAI PEGAR O FANTASMA:
    console.log(`\n❌ [ERRO CRÍTICO DE INICIALIZAÇÃO]:`);
    console.error(err.message || err);
    console.log(`====================================================\n`);
    process.exit(1);
  }
};

// Captura erros globais não tratados que derrubam o Node em silêncio
process.on('unhandledRejection', (reason) => {
  console.error('\n🚨 Erro Assíncrono Não Tratado (Unhandled Rejection):', reason);
});

start();