import { Role } from '../enums/role.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

/** UserSummaryResponse */
export interface UsuarioResumo {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  active: boolean;
}

/** Resposta de /auth/login e /auth/refresh. */
export interface TokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
  refreshToken: string;
  /** Presente no login; o refresh pode omitir. */
  user?: UsuarioResumo;
}
