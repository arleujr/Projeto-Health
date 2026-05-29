import dotenv from 'dotenv';
dotenv.config();

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secure-fallback-secret-key-32chars',
    expiresIn: '1d',
  },
};