import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { SimulacaoResultadoComponent } from './simulacao-resultado.component';

describe('SimulacaoResultadoComponent', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimulacaoResultadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), MessageService],
    }).overrideTemplate(SimulacaoResultadoComponent, '');
    http = TestBed.inject(HttpTestingController);
  });

  it('link para simulação inexistente mostra "não encontrada", não "nenhuma simulação executada"', () => {
    const fixture = TestBed.createComponent(SimulacaoResultadoComponent);
    fixture.componentRef.setInput('id', 'sim-que-nao-existe');
    fixture.detectChanges();

    http.expectOne('/api/v1/simulations/sim-que-nao-existe').flush({ status: 404 }, { status: 404, statusText: 'Not Found' });

    expect(fixture.componentInstance.naoEncontrada()).toBe(true);
    expect(fixture.componentInstance.semSimulacao()).toBe(false);
  });

  it('sem id e sem nenhuma simulação, mostra o estado inicial', () => {
    const fixture = TestBed.createComponent(SimulacaoResultadoComponent);
    fixture.detectChanges();

    http.expectOne('/api/v1/simulations/latest').flush({ status: 404 }, { status: 404, statusText: 'Not Found' });

    expect(fixture.componentInstance.semSimulacao()).toBe(true);
    expect(fixture.componentInstance.naoEncontrada()).toBe(false);
  });
});
