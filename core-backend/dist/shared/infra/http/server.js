import 'dotenv/config';
import { app } from './app.js';
const PORT = Number(process.env.PORT) || 3333;
const start = async () => {
    try {
        // Escuta em 0.0.0.0 para permitir conexões externas (Docker, Celular físico no Wi-Fi, etc.)
        await app.listen({
            port: PORT,
            host: '0.0.0.0'
        });
        console.log(`\n============= HEALTH TECH CORE-BACKEND =============`);
        console.log(`🚀 Servidor voando baixo em http://localhost:${PORT}`);
        console.log(`🎯 Rotas de Onboarding, Login e Anamnese Prontas!`);
        console.log(`====================================================\n`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
