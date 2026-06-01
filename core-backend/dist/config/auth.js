import dotenv from 'dotenv';
dotenv.config();
export const authConfig = {
    jwt: {
        secret: process.env.APP_SECRET || 'fallback_secret_key_production_unsecured',
        expiresIn: '1d',
    },
};
