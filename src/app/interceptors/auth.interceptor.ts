import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, map, Observable, shareReplay, switchMap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { SKIP_AUTH } from './http-context.tokens';

/**
 * Anexa o JWT às chamadas da API e, ao receber 401, renova o token uma
 * única vez: requisições concorrentes aguardam o mesmo refresh (fila) e
 * são reenviadas com o novo token. Se o refresh falhar, a sessão é encerrada.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly storage = inject(TokenStorageService);
  private readonly authService = inject(AuthService);

  private refreshEmAndamento$: Observable<string> | null = null;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.context.get(SKIP_AUTH) || !req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    const tokenUsado = this.storage.accessToken;
    return next.handle(this.comToken(req, tokenUsado)).pipe(
      catchError((erro: unknown) => {
        if (erro instanceof HttpErrorResponse && erro.status === 401 && this.storage.refreshToken) {
          return this.renovarEReenviar(req, next, tokenUsado);
        }
        return throwError(() => erro);
      }),
    );
  }

  private renovarEReenviar(
    req: HttpRequest<unknown>,
    next: HttpHandler,
    tokenUsado: string | null,
  ): Observable<HttpEvent<unknown>> {
    // Outro request já renovou o token enquanto este estava em voo: só reenviar.
    const tokenAtual = this.storage.accessToken;
    if (tokenAtual && tokenAtual !== tokenUsado && !this.refreshEmAndamento$) {
      return next.handle(this.comToken(req, tokenAtual));
    }

    if (!this.refreshEmAndamento$) {
      this.refreshEmAndamento$ = this.authService.refresh().pipe(
        map((tokens) => tokens.accessToken),
        catchError((erro: unknown) => {
          this.authService.encerrarSessao(true);
          return throwError(() => erro);
        }),
        finalize(() => (this.refreshEmAndamento$ = null)),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }

    return this.refreshEmAndamento$.pipe(switchMap((token) => next.handle(this.comToken(req, token))));
  }

  private comToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
    return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  }
}
