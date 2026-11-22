import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let messages: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MessageService,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    messages = TestBed.inject(MessageService);
  });

  it('mostra um toast só quando requisições paralelas falham pelo mesmo motivo', () => {
    const add = jest.spyOn(messages, 'add');
    http.get('/api/v1/a').subscribe({ error: () => undefined });
    http.get('/api/v1/b').subscribe({ error: () => undefined });

    for (const url of ['/api/v1/a', '/api/v1/b']) {
      backend.expectOne(url).flush({ status: 503, errorCode: 'RISK_ENGINE_UNAVAILABLE' }, { status: 503, statusText: 'Unavailable' });
    }

    expect(add).toHaveBeenCalledTimes(1);
    expect(add.mock.calls[0][0].detail).toBe('O motor de simulação está indisponível. Tente novamente em instantes.');
  });

  it('erros diferentes geram toasts diferentes', () => {
    const add = jest.spyOn(messages, 'add');
    http.get('/api/v1/a').subscribe({ error: () => undefined });
    http.get('/api/v1/b').subscribe({ error: () => undefined });

    backend.expectOne('/api/v1/a').flush({ errorCode: 'INVALID_TAX_ID' }, { status: 422, statusText: 'x' });
    backend.expectOne('/api/v1/b').flush({ errorCode: 'DUPLICATE_ACCOUNT_NAME' }, { status: 422, statusText: 'x' });

    expect(add).toHaveBeenCalledTimes(2);
  });
});
