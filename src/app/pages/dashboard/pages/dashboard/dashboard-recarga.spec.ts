import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent sem chamadas duplicadas', () => {
  it('não recarrega quando o datepicker ou o seletor emitem o valor que já está ativo', () => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).overrideTemplate(DashboardComponent, '');
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;
    http.match(() => true).forEach((r) => r.flush(null));

    c.aoMudarData(new Date(c.dataReferencia().getTime()));
    c.aoMudarHistorico(c.diasHistorico());

    http.expectNone((r) => r.url.startsWith('/api/v1/dashboard'));
  });
});
