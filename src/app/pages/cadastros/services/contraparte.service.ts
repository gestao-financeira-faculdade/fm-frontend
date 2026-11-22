import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PagedResult, TAMANHO_MAXIMO_PAGINA } from '../../../interfaces/paged-result.interface';
import { Contraparte, ContraparteRequest } from '../interfaces/contraparte.interface';

@Injectable({ providedIn: 'root' })
export class ContraparteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/counterparties`;

  /** As listas de cadastro são paginadas no backend; telas e selects carregam uma página com todos os ativos. */
  listar(): Observable<Contraparte[]> {
    return this.http
      .get<PagedResult<Contraparte>>(this.url, { params: { page: 0, size: TAMANHO_MAXIMO_PAGINA } })
      .pipe(map((pagina) => pagina.items));
  }

  buscar(id: string): Observable<Contraparte> {
    return this.http.get<Contraparte>(`${this.url}/${id}`);
  }

  criar(contraparte: ContraparteRequest): Observable<Contraparte> {
    return this.http.post<Contraparte>(this.url, contraparte);
  }
}
