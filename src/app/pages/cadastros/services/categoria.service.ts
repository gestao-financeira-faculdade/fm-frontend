import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Categoria, CategoriaRequest } from '../interfaces/categoria.interface';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/categories`;

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  buscar(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.url}/${id}`);
  }

  criar(categoria: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, categoria);
  }
}
