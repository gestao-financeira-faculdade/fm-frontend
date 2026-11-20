import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoDiffComponent } from './estado-diff.component';

describe('EstadoDiffComponent', () => {
  let fixture: ComponentFixture<EstadoDiffComponent>;

  const dinheiro = (amount: number) => ({ zero: amount === 0, amount, currency: 'BRL', negative: false, positive: amount > 0 });

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [EstadoDiffComponent] }).overrideTemplate(EstadoDiffComponent, '');
    fixture = TestBed.createComponent(EstadoDiffComponent);
  });

  function linhas(anterior: unknown, novo: unknown) {
    fixture.componentRef.setInput('anterior', anterior);
    fixture.componentRef.setInput('novo', novo);
    return Object.fromEntries(fixture.componentInstance.linhas().map((l) => [l.campo, l]));
  }

  it('formata Money como moeda em vez de JSON cru', () => {
    const l = linhas({ originalAmount: dinheiro(1000) }, { originalAmount: dinheiro(1500.5) });
    expect(l['originalAmount'].antes).toBe('R$ 1.000,00');
    expect(l['originalAmount'].depois).toBe('R$ 1.500,50');
    expect(l['originalAmount'].alterado).toBe(true);
  });

  it('compara o lançamento liquidado do envelope da baixa parcial e mostra o residual', () => {
    const anterior = { status: 'PENDING', settledAmount: null };
    const novo = {
      settledEntry: { status: 'PAID', settledAmount: dinheiro(250) },
      residualChildEntry: { id: 'filho-1', status: 'PENDING', originalAmount: dinheiro(750) },
    };

    const l = linhas(anterior, novo);

    expect(l['status']).toMatchObject({ antes: 'PENDING', depois: 'PAID', alterado: true });
    expect(l['settledAmount'].depois).toBe('R$ 250,00');
    expect(l['residualChildEntry'].depois).toBe('filho-1 (R$ 750,00)');
    expect(l['settledEntry']).toBeUndefined();
  });

  it('ainda aceita o estado como string JSON', () => {
    const l = linhas('{"status":"PENDING"}', '{"status":"PAID"}');
    expect(l['status']).toMatchObject({ antes: 'PENDING', depois: 'PAID' });
  });
});
