import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Anexo } from '../interfaces/anexo.interface';

@Injectable({ providedIn: 'root' })
export class AnexoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/v1/entries`;

  listar(entryId: string): Observable<Anexo[]> {
    return this.http.get<Anexo[]>(`${this.url}/${entryId}/attachments`);
  }

  /** Upload multipart (campo "file"). Emite eventos de progresso. */
  enviar(entryId: string, arquivo: File): Observable<HttpEvent<Anexo>> {
    const corpo = new FormData();
    corpo.append('file', arquivo, arquivo.name);
    return this.http.post<Anexo>(`${this.url}/${entryId}/attachments`, corpo, {
      reportProgress: true,
      observe: 'events',
    });
  }

  baixar(entryId: string, attachmentId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.url}/${entryId}/attachments/${attachmentId}/download`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
