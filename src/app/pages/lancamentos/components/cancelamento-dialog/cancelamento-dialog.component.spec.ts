import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { Lancamento } from '../../interfaces/lancamento.interface';
import { CancelamentoDialogComponent } from './cancelamento-dialog.component';

describe('CancelamentoDialogComponent', () => {
  let fixture: ComponentFixture<CancelamentoDialogComponent>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelamentoDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).overrideTemplate(CancelamentoDialogComponent, '');
    fixture = TestBed.createComponent(CancelamentoDialogComponent);
    fixture.componentRef.setInput('lancamento', { id: 'e1' } as Lancamento);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('não aceita motivo que só atinge 5 caracteres por causa dos espaços', () => {
    const c = fixture.componentInstance;
    c.form.setValue({ reason: '  ab  ' });
    c.confirmar();

    http.expectNone((r) => r.url === '/api/v1/entries/e1');
    expect(c.form.controls.reason.hasError('minimoAposTrim')).toBe(true);
  });

  it('envia o motivo sem os espaços das pontas', () => {
    const c = fixture.componentInstance;
    c.form.setValue({ reason: '   Duplicado no ERP   ' });
    c.confirmar();

    const req = http.expectOne((r) => r.url === '/api/v1/entries/e1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.params.get('reason')).toBe('Duplicado no ERP');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('fecha e pede recarga da tela quando o backend recusa com 422', () => {
    const c = fixture.componentInstance;
    const desatualizado = jest.fn();
    c.desatualizado.subscribe(desatualizado);
    c.visivel.set(true);
    c.form.setValue({ reason: 'Lançamento já liquidado' });
    c.confirmar();

    http.expectOne((r) => r.url === '/api/v1/entries/e1').flush(
      { status: 422, errorCode: 'ENTRY_NOT_CANCELLABLE' },
      { status: 422, statusText: 'Unprocessable Entity' },
    );

    expect(desatualizado).toHaveBeenCalledTimes(1);
    expect(c.visivel()).toBe(false);
  });
});
