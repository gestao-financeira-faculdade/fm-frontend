import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { montarParams } from '../../../utils/http-params.util';
import { FiltroLancamento } from '../../lancamentos/interfaces/lancamento.interface';
import { FormatoRelatorio } from '../enums/formato-relatorio.enum';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/reports`;

  /** GET /v1/reports/entries/export?format=CSV|PDF&filtros... */
  exportarLancamentos(formato: FormatoRelatorio, filtro: FiltroLancamento): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.url}/entries/export`, {
      params: montarParams({ format: formato, ...filtro }),
      responseType: 'blob',
      observe: 'response',
    });
  }
}
