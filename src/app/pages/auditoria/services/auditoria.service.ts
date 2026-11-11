import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { normalizarPagina, Paginacao, PagedResult } from '../../../interfaces/paged-result.interface';
import { montarParams } from '../../../utils/http-params.util';
import { FiltroAuditoria, RegistroAuditoria } from '../interfaces/auditoria.interface';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  /** GET /v1/audit-logs — ADMIN ou AUDITOR. */
  listar(filtro: FiltroAuditoria, paginacao: Paginacao): Observable<PagedResult<RegistroAuditoria>> {
    return this.http
      .get<unknown>(`${this.api}/v1/audit-logs`, { params: montarParams({ ...filtro, ...paginacao }) })
      .pipe(map((raw) => normalizarPagina<RegistroAuditoria>(raw)));
  }

  /** GET /v1/entries/{entryId}/audit-history — linha do tempo do lançamento. */
  historicoLancamento(entryId: string): Observable<RegistroAuditoria[]> {
    return this.http.get<RegistroAuditoria[]>(`${this.api}/v1/entries/${entryId}/audit-history`);
  }
}
