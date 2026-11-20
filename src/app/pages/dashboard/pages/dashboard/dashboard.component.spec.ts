import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).overrideTemplate(DashboardComponent, '');
    http = TestBed.inject(HttpTestingController);
  });

  it('lê as faixas e o simulationId de dentro de projectionCone e encerra o carregamento', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;

    http.expectOne((r) => r.url === '/api/v1/dashboard/kpis').flush(null);
    http.expectOne((r) => r.url === '/api/v1/dashboard/uncertainty-cone').flush({
      historicalSeries: [{ date: '2026-11-18', balance: { amount: 1000, currency: 'BRL' } }],
      projectionCone: {
        simulationId: 'sim-1',
        horizonDays: 30,
        numScenarios: 100000,
        var99: { amount: 10, currency: 'BRL' },
        medianP50: { amount: 20, currency: 'BRL' },
        ruinProbabilityPct: { value: 0 },
        executionDevice: 'JVM',
        createdAt: '2026-11-19T00:00:00Z',
        dailyBands: [{ dayOffset: 1, date: '2026-11-19', p01: 1, p05: 2, p25: 3, p50: 4, p75: 5, p95: 6 }],
      },
    });

    expect(c.carregandoCone()).toBe(false);
    expect(c.projecao()).toEqual([{ rotulo: '19/11', p01: 1, p05: 2, p25: 3, p50: 4, p75: 5, p95: 6 }]);
    expect(c.simulacaoId()).toBe('sim-1');
  });

  it('sem simulação, o cone fica vazio sem erro', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;

    http.expectOne((r) => r.url === '/api/v1/dashboard/kpis').flush(null);
    http.expectOne((r) => r.url === '/api/v1/dashboard/uncertainty-cone').flush({ historicalSeries: [], projectionCone: null });

    expect(c.carregandoCone()).toBe(false);
    expect(c.projecao()).toEqual([]);
    expect(c.simulacaoId()).toBeNull();
  });
});
