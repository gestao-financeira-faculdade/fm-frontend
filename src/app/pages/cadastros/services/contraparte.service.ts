import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Contraparte, ContraparteRequest } from '../interfaces/contraparte.interface';

@Injectable({ providedIn: 'root' })
export class ContraparteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/counterparties`;

  listar(): Observable<Contraparte[]> {
    return this.http.get<Contraparte[]>(this.url);
  }

  buscar(id: string): Observable<Contraparte> {
    return this.http.get<Contraparte>(`${this.url}/${id}`);
  }

  criar(contraparte: ContraparteRequest): Observable<Contraparte> {
    return this.http.post<Contraparte>(this.url, contraparte);
  }
}
