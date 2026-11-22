import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { semToastDeErro } from '../../../interceptors/http-context.tokens';
import { normalizarPagina, Paginacao, PagedResult } from '../../../interfaces/paged-result.interface';
import { montarParams } from '../../../utils/http-params.util';
import {
  FiltroLancamento,
  Lancamento,
  LancamentoRequest,
  LancamentoResumo,
  NoDesdobramento,
} from '../interfaces/lancamento.interface';
import { LiquidacaoRequest, LiquidacaoResponse } from '../interfaces/liquidacao.interface';

@Injectable({ providedIn: 'root' })
export class LancamentoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/entries`;

  /**
   * POST /v1/entries. Reutilize a mesma idempotencyKey em retentativas
   * do mesmo formulário para o backend não duplicar o lançamento.
   */
  criar(lancamento: LancamentoRequest, idempotencyKey: string): Observable<Lancamento> {
    return this.http.post<Lancamento>(this.url, lancamento, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  }

  listar(filtro: FiltroLancamento, paginacao: Paginacao): Observable<PagedResult<LancamentoResumo>> {
    return this.http
      .get<unknown>(this.url, { params: montarParams({ ...filtro, ...paginacao }) })
      .pipe(map((raw) => normalizarPagina<LancamentoResumo>(raw)));
  }

  buscar(id: string): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.url}/${id}`);
  }

  /** Erros (409 / 422) são tratados no diálogo de liquidação, sem toast global. */
  liquidar(id: string, liquidacao: LiquidacaoRequest): Observable<LiquidacaoResponse> {
    return this.http.post<LiquidacaoResponse>(`${this.url}/${id}/settle`, liquidacao, {
      context: semToastDeErro(),
    });
  }

  /** DELETE /v1/entries/{id}?reason= (cancelamento lógico, 204) — exclusivo ADMIN. */
  cancelar(id: string, reason: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { params: { reason } });
  }

  desdobramentos(id: string): Observable<NoDesdobramento[]> {
    return this.http.get<NoDesdobramento[]>(`${this.url}/${id}/splits`);
  }

  /** GET /v1/reports/entries/export?format=CSV|PDF com os filtros da listagem. */
  exportar(formato: 'csv' | 'pdf', filtro: FiltroLancamento): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}/v1/reports/entries/export`, {
      params: montarParams({ format: formato.toUpperCase(), ...filtro }),
      responseType: 'blob',
      observe: 'response',
    });
  }
}
