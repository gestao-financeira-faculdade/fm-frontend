import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SharedModule } from '../../../../shared/share.module';
import { Lancamento } from '../../interfaces/lancamento.interface';
import { LiquidacaoDialogComponent } from './liquidacao-dialog.component';

registerLocaleData(localePt);

describe('LiquidacaoDialogComponent', () => {
  let fixture: ComponentFixture<LiquidacaoDialogComponent>;
  let http: HttpTestingController;

  const lancamento = {
    id: 'e1',
    description: 'Fornecedor X',
    entryType: 'PAYABLE',
    status: 'PENDING',
    originalAmount: 1000,
    outstandingAmount: 1000,
    currency: 'BRL',
    dueDate: '2026-12-31',
    version: 3,
  } as unknown as Lancamento;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiquidacaoDialogComponent],
      imports: [SharedModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiquidacaoDialogComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('lancamento', lancamento);
    fixture.componentInstance.visivel.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  function liquidarParcial() {
    const c = fixture.componentInstance;
    c.form.patchValue({ paidAmount: 400, allowPartial: true, settlementDate: new Date(2026, 10, 19) });
    c.salvar();
    return http.expectOne('/api/v1/entries/e1/settle');
  }

  it('pré-preenche o valor pago com o saldo em aberto', () => {
    expect(fixture.componentInstance.form.controls.paidAmount.value).toBe(1000);
  });

  it('envia a baixa parcial com paidAmount, allowPartial e a versão atual como expectedVersion', () => {
    const req = liquidarParcial();

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      paidAmount: 400,
      discountAmount: 0,
      interestAmount: 0,
      lateFeeAmount: 0,
      settlementDate: '2026-11-19',
      allowPartial: true,
      expectedVersion: 3,
    });
    req.flush({ id: 'e1', status: 'PAID', settledAmount: 400, hasResidualChild: true, residualEntryId: 'e2', version: 4 });
  });

  it('não envia a baixa a menor sem a permissão de baixa parcial', () => {
    const c = fixture.componentInstance;
    c.form.patchValue({ paidAmount: 400, allowPartial: false });
    c.salvar();

    http.expectNone('/api/v1/entries/e1/settle');
    expect(c.erro()?.mensagem).toContain('Permitir baixa parcial');
  });

  it('classifica o 422 MISSING_FISCAL_ATTACHMENT como falta de anexo', () => {
    liquidarParcial().flush(
      { status: 422, errorCode: 'MISSING_FISCAL_ATTACHMENT', detail: 'Fiscal attachment is mandatory' },
      { status: 422, statusText: 'Unprocessable Entity' },
    );

    expect(fixture.componentInstance.erro()?.tipo).toBe('anexo');
  });

  it('classifica o 409 como conflito de versão', () => {
    liquidarParcial().flush(
      { status: 409, errorCode: 'CONCURRENCY_CONFLICT' },
      { status: 409, statusText: 'Conflict' },
    );

    expect(fixture.componentInstance.erro()?.tipo).toBe('conflito');
  });
});
