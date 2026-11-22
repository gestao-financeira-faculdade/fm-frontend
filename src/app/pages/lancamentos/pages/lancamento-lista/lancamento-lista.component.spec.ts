import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

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

describe('LancamentoListaComponent com filtros na URL', () => {
  it('restaura filtros e página da URL e grava os filtros aplicados na URL', () => {
    TestBed.configureTestingModule({
      declarations: [LancamentoListaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: { status: 'OVERDUE', search: 'aws', page: '2', size: '50', de: '2026-11-01', ate: '2026-11-30' } } },
        },
      ],
    }).overrideTemplate(LancamentoListaComponent, '');
    const http = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    const navegar = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(LancamentoListaComponent);
    const c = fixture.componentInstance;
    c.ngOnInit();

    expect(c.filtros.getRawValue().status).toBe('OVERDUE');
    expect(c.filtros.getRawValue().search).toBe('aws');
    expect(c.linhas()).toBe(50);
    expect(c.primeiro()).toBe(100);

    c.aoCarregar({ first: 100, rows: 50 });
    const req = http.expectOne((r) => r.url === '/api/v1/entries');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('status')).toBe('OVERDUE');
    expect(req.request.params.get('dueDateFrom')).toBe('2026-11-01');
    req.flush({ items: [], totalElements: 0, page: 2, size: 50 });
    http.match(() => true).forEach((r) => r.flush([]));

    expect(navegar).toHaveBeenCalledWith([], expect.objectContaining({
      replaceUrl: true,
      queryParams: expect.objectContaining({ status: 'OVERDUE', search: 'aws', page: 2, size: 50, de: '2026-11-01', ate: '2026-11-30' }),
    }));
  });
});
