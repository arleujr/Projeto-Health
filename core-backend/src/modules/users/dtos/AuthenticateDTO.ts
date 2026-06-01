import { UserRole } from '@prisma/client';

export interface AuthenticateUserDTO {
  email: string;
  password?: string; // Opcional caso use login sem senha no futuro, mas obrigatório no fluxo atual
}

export interface AuthenticateResponseDTO {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: UserRole;
  };
  token: string;
}