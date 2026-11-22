import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PagedResult, TAMANHO_MAXIMO_PAGINA } from '../../../interfaces/paged-result.interface';
import { ContaFinanceira, ContaFinanceiraRequest } from '../interfaces/conta.interface';

@Injectable({ providedIn: 'root' })
export class ContaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/accounts`;

  /** As listas de cadastro são paginadas no backend; telas e selects carregam uma página com todos os ativos. */
  listar(): Observable<ContaFinanceira[]> {
    return this.http
      .get<PagedResult<ContaFinanceira>>(this.url, { params: { page: 0, size: TAMANHO_MAXIMO_PAGINA } })
      .pipe(map((pagina) => pagina.items));
  }

  buscar(id: string): Observable<ContaFinanceira> {
    return this.http.get<ContaFinanceira>(`${this.url}/${id}`);
  }

  criar(conta: ContaFinanceiraRequest): Observable<ContaFinanceira> {
    return this.http.post<ContaFinanceira>(this.url, conta);
  }
}
