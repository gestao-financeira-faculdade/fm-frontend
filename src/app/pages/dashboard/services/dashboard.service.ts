import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { semToastDeErro } from '../../../interceptors/http-context.tokens';
import { montarParams } from '../../../utils/http-params.util';
import { ConeIncertezaResponse, FiltroCone, KpiExecutivo } from '../interfaces/dashboard.interface';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/dashboard`;

  kpis(referenceDate?: string | null): Observable<KpiExecutivo> {
    return this.http.get<KpiExecutivo>(`${this.url}/kpis`, { params: montarParams({ referenceDate }) });
  }

  /** Sem toast global: ausência de simulação é um estado vazio, não um erro. */
  coneIncerteza(filtro: FiltroCone): Observable<ConeIncertezaResponse> {
    return this.http.get<ConeIncertezaResponse>(`${this.url}/uncertainty-cone`, {
      params: montarParams(filtro),
      context: semToastDeErro(),
    });
  }
}
