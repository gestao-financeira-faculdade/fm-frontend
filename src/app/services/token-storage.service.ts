import { Injectable } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage-keys';
import { TokenResponse, UsuarioResumo } from '../interfaces/auth.interface';

/**
 * Persistência local da sessão. Os tokens ficam no localStorage para
 * sobreviver ao fechamento do PWA; o access token é curto (15 min) e o
 * refresh token é rotacionado a cada renovação.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  get accessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.refreshToken);
  }

  get usuario(): UsuarioResumo | null {
    const bruto = localStorage.getItem(STORAGE_KEYS.usuario);
    if (!bruto) return null;
    try {
      return JSON.parse(bruto) as UsuarioResumo;
    } catch {
      return null;
    }
  }

  salvarTokens(tokens: TokenResponse): void {
    localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    if (tokens.user) this.salvarUsuario(tokens.user);
  }

  salvarUsuario(usuario: UsuarioResumo): void {
    localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(usuario));
  }

  limpar(): void {
    Object.values(STORAGE_KEYS).forEach((chave) => localStorage.removeItem(chave));
  }
}
