import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LancamentoListaComponent } from './lancamento-lista.component';

describe('LancamentoListaComponent', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LancamentoListaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).overrideTemplate(LancamentoListaComponent, '');
    http = TestBed.inject(HttpTestingController);
  });

  it('limpa a tabela quando o filtro falha, em vez de manter os dados sem filtro', () => {
    const c = TestBed.createComponent(LancamentoListaComponent).componentInstance;

    c.filtrar();
    http.expectOne((r) => r.url === '/api/v1/entries').flush({
      items: [{ id: 'e1' }],
      totalElements: 1,
      page: 0,
      size: 20,
    });
    expect(c.lancamentos().length).toBe(1);

    c.filtros.patchValue({ search: 'x'.repeat(300) });
    c.filtrar();
    http.expectOne((r) => r.url === '/api/v1/entries').flush(
      { status: 400, detail: 'search too long' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(c.lancamentos()).toEqual([]);
    expect(c.total()).toBe(0);
    expect(c.falhaNaBusca()).toBe(true);
  });
});
