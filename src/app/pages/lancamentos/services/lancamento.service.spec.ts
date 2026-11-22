import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LancamentoService } from './lancamento.service';

describe('LancamentoService', () => {
  let service: LancamentoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(LancamentoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('cancela com DELETE e o motivo na query, aceitando 204 sem corpo', () => {
    let concluiu = false;
    service.cancelar('e1', 'Duplicado').subscribe(() => (concluiu = true));

    const req = http.expectOne((r) => r.url === '/api/v1/entries/e1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.params.get('reason')).toBe('Duplicado');
    expect(req.request.body).toBeNull();
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(concluiu).toBe(true);
  });

  it('exporta pela rota única com o formato em maiúsculas e os filtros', () => {
    service.exportar('pdf', { entryType: 'PAYABLE' } as never).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/reports/entries/export');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('format')).toBe('PDF');
    expect(req.request.params.get('entryType')).toBe('PAYABLE');
    req.flush(new Blob());
  });
});
