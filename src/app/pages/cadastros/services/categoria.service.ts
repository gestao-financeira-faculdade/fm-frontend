import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PagedResult, TAMANHO_MAXIMO_PAGINA } from '../../../interfaces/paged-result.interface';
import { Categoria, CategoriaRequest } from '../interfaces/categoria.interface';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/categories`;

  /** As listas de cadastro são paginadas no backend; telas e selects carregam uma página com todos os ativos. */
  listar(): Observable<Categoria[]> {
    return this.http
      .get<PagedResult<Categoria>>(this.url, { params: { page: 0, size: TAMANHO_MAXIMO_PAGINA } })
      .pipe(map((pagina) => pagina.items));
  }

  buscar(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.url}/${id}`);
  }

  criar(categoria: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, categoria);
  }
}
