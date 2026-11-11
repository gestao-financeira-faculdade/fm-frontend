import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';

import { mensagemErro } from '../utils/problem-detail.util';
import { SKIP_ERROR_TOAST } from './http-context.tokens';

/**
 * Converte erros ProblemDetail (RFC 9457) em toasts. Registrado ANTES do
 * AuthInterceptor, portanto só enxerga o resultado final (após refresh).
 * 401 é tratado pelo AuthInterceptor e não gera toast aqui.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly messageService = inject(MessageService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((erro: unknown) => {
        if (!(erro instanceof HttpErrorResponse)) return throwError(() => erro);

        // Downloads (responseType: 'blob') recebem o ProblemDetail como Blob.
        const normalizado$ =
          erro.error instanceof Blob
            ? from(erro.error.text()).pipe(switchMap((texto) => throwError(() => this.comCorpoTexto(erro, texto))))
            : throwError(() => erro);

        return normalizado$.pipe(
          catchError((final: HttpErrorResponse) => {
            if (final.status !== 401 && !req.context.get(SKIP_ERROR_TOAST)) {
              this.messageService.add({
                severity: final.status >= 500 || final.status === 0 ? 'error' : 'warn',
                summary: this.titulo(final.status),
                detail: mensagemErro(final),
                life: 6000,
              });
            }
            return throwError(() => final);
          }),
        );
      }),
    );
  }

  private comCorpoTexto(erro: HttpErrorResponse, texto: string): HttpErrorResponse {
    let corpo: unknown = texto;
    try {
      corpo = JSON.parse(texto);
    } catch {
      /* mantém texto */
    }
    return new HttpErrorResponse({
      error: corpo,
      headers: erro.headers,
      status: erro.status,
      statusText: erro.statusText,
      url: erro.url ?? undefined,
    });
  }

  private titulo(status: number): string {
    switch (status) {
      case 0:
        return 'Sem conexão';
      case 400:
        return 'Dados inválidos';
      case 403:
        return 'Acesso negado';
      case 404:
        return 'Não encontrado';
      case 409:
        return 'Conflito de concorrência';
      case 422:
        return 'Regra de negócio';
      case 503:
        return 'Serviço indisponível';
      default:
        return status >= 500 ? 'Erro no servidor' : 'Erro';
    }
  }
}
