"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const port = Number(process.env.PORT) || 3333;
const start = async () => {
    try {
        await app_js_1.app.listen({ port, host: '0.0.0.0' });
        console.log(`[ProductionEngine]: Fastify Premium Core listening on port ${port}`);
    }
    catch (err) {
        app_js_1.app.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map