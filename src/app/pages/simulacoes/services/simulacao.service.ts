import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { semToastDeErro } from '../../../interceptors/http-context.tokens';
import { Simulacao, SimulacaoRequest } from '../interfaces/simulacao.interface';

@Injectable({ providedIn: 'root' })
export class SimulacaoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/simulations`;

  /** POST — exclusivo ADMIN. 422/503 são exibidos no próprio diálogo. */
  executar(parametros: SimulacaoRequest): Observable<Simulacao> {
    return this.http.post<Simulacao>(this.url, parametros, { context: semToastDeErro() });
  }

  /** 404 quando nenhuma simulação foi executada: tratado como estado vazio. */
  ultima(): Observable<Simulacao> {
    return this.http.get<Simulacao>(`${this.url}/latest`, { context: semToastDeErro() });
  }

  buscar(id: string): Observable<Simulacao> {
    return this.http.get<Simulacao>(`${this.url}/${id}`, { context: semToastDeErro() });
  }
}
