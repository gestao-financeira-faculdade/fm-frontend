import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaSimulacaoDialogComponent } from './nova-simulacao-dialog.component';

describe('NovaSimulacaoDialogComponent', () => {
  let fixture: ComponentFixture<NovaSimulacaoDialogComponent>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovaSimulacaoDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).overrideTemplate(NovaSimulacaoDialogComponent, '');
    fixture = TestBed.createComponent(NovaSimulacaoDialogComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envia a semente como texto, sem perder dígitos acima de 2^53', () => {
    const c = fixture.componentInstance;
    c.form.patchValue({ randomSeed: '8361509756792018453' });
    c.executar();

    const req = http.expectOne('/api/v1/simulations');
    expect(req.request.body.randomSeed).toBe('8361509756792018453');
    req.flush({});
  });

  it('bloqueia choque de custo negativo, que o backend recusa', () => {
    const c = fixture.componentInstance;
    c.form.patchValue({ variableCostShockPct: -5 });
    c.executar();

    http.expectNone('/api/v1/simulations');
    expect(c.form.controls.variableCostShockPct.hasError('min')).toBe(true);
  });
});
