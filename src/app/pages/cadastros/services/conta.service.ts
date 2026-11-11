import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ContaFinanceira, ContaFinanceiraRequest } from '../interfaces/conta.interface';

@Injectable({ providedIn: 'root' })
export class ContaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/accounts`;

  listar(): Observable<ContaFinanceira[]> {
    return this.http.get<ContaFinanceira[]>(this.url);
  }

  buscar(id: string): Observable<ContaFinanceira> {
    return this.http.get<ContaFinanceira>(`${this.url}/${id}`);
  }

  criar(conta: ContaFinanceiraRequest): Observable<ContaFinanceira> {
    return this.http.post<ContaFinanceira>(this.url, conta);
  }
}
