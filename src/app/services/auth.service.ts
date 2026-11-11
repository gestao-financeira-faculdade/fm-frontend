import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize, Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Role } from '../enums/role.enum';
import { SKIP_AUTH } from '../interceptors/http-context.tokens';
import { LoginRequest, TokenResponse, UsuarioResumo } from '../interfaces/auth.interface';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(TokenStorageService);
  private readonly messageService = inject(MessageService);

  private readonly url = `${environment.apiUrl}/v1/auth`;
  private readonly usuarioAtual = signal<UsuarioResumo | null>(this.storage.usuario);

  readonly usuario = this.usuarioAtual.asReadonly();
  readonly role = computed(() => this.usuarioAtual()?.role ?? null);

  /** Há sessão se existe refresh token; o access token expirado é renovado pelo interceptor. */
  estaAutenticado(): boolean {
    return !!this.storage.refreshToken;
  }

  temPermissao(roles: readonly Role[] | null | undefined): boolean {
    if (!roles || roles.length === 0) return true;
    const role = this.role();
    return !!role && roles.includes(role);
  }

  login(credenciais: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.url}/login`, credenciais, { context: new HttpContext().set(SKIP_AUTH, true) })
      .pipe(tap((tokens) => this.aplicarTokens(tokens)));
  }

  /** Usado pelo AuthInterceptor. Rotaciona access e refresh token. */
  refresh(): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(
        `${this.url}/refresh`,
        { refreshToken: this.storage.refreshToken },
        { context: new HttpContext().set(SKIP_AUTH, true) },
      )
      .pipe(tap((tokens) => this.aplicarTokens(tokens)));
  }

  me(): Observable<UsuarioResumo> {
    return this.http.get<UsuarioResumo>(`${this.url}/me`).pipe(
      tap((usuario) => {
        this.storage.salvarUsuario(usuario);
        this.usuarioAtual.set(usuario);
      }),
    );
  }

  logout(): void {
    const refreshToken = this.storage.refreshToken;
    if (!refreshToken) {
      this.encerrarSessao();
      return;
    }
    this.http
      .post<void>(`${this.url}/logout`, { refreshToken })
      .pipe(finalize(() => this.encerrarSessao()))
      .subscribe({ error: () => undefined });
  }

  /** Limpa a sessão local e volta ao login. */
  encerrarSessao(expirada = false): void {
    this.storage.limpar();
    this.usuarioAtual.set(null);
    if (expirada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sessão expirada',
        detail: 'Faça login novamente para continuar.',
      });
    }
    const returnUrl = expirada ? this.router.url : undefined;
    void this.router.navigate(['/login'], { queryParams: returnUrl ? { returnUrl } : {} });
  }

  private aplicarTokens(tokens: TokenResponse): void {
    this.storage.salvarTokens(tokens);
    if (tokens.user) this.usuarioAtual.set(tokens.user);
  }
}
