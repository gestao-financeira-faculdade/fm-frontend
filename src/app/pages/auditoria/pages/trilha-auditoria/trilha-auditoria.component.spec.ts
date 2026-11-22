import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TrilhaAuditoriaComponent } from './trilha-auditoria.component';

describe('TrilhaAuditoriaComponent', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrilhaAuditoriaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).overrideTemplate(TrilhaAuditoriaComponent, '');
    http = TestBed.inject(HttpTestingController);
  });

  it('diferencia falta de permissão de lista vazia', () => {
    const c = TestBed.createComponent(TrilhaAuditoriaComponent).componentInstance;

    c.filtrar();
    http.expectOne((r) => r.url === '/api/v1/audit-logs').flush({ status: 403 }, { status: 403, statusText: 'Forbidden' });

    expect(c.falha()).toBe('sem-permissao');
    expect(c.registros()).toEqual([]);

    c.filtrar();
    http.expectOne((r) => r.url === '/api/v1/audit-logs').flush({ items: [], totalElements: 0, page: 0, size: 20 });

    expect(c.falha()).toBeNull();
  });
});
