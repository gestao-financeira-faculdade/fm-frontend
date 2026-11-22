import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CategoriaService } from './categoria.service';
import { ContaService } from './conta.service';
import { ContraparteService } from './contraparte.service';

describe('serviços de cadastro com listas paginadas', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it.each([
    ['categorias', CategoriaService, '/api/v1/categories'],
    ['contas', ContaService, '/api/v1/accounts'],
    ['contrapartes', ContraparteService, '/api/v1/counterparties'],
  ])('lista %s lendo items da página', (_nome, servico, url) => {
    let itens: unknown[] = [];
    (TestBed.inject(servico as never) as { listar: () => { subscribe: (f: (v: unknown[]) => void) => void } })
      .listar()
      .subscribe((v) => (itens = v));

    const req = http.expectOne((r) => r.url === url);
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('500');
    req.flush({ items: [{ id: 'a' }, { id: 'b' }], totalElements: 2, page: 0, size: 500, totalPages: 1 });

    expect(itens).toEqual([{ id: 'a' }, { id: 'b' }]);
  });
});
