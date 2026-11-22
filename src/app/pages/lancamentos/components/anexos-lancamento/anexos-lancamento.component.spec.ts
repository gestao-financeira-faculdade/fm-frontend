import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';

import { AnexosLancamentoComponent } from './anexos-lancamento.component';

describe('AnexosLancamentoComponent', () => {
  it('avisa quando o arquivo escolhido tem tipo não aceito, em vez de descartar em silêncio', () => {
    TestBed.configureTestingModule({
      declarations: [AnexosLancamentoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).overrideTemplate(AnexosLancamentoComponent, '');
    const fixture = TestBed.createComponent(AnexosLancamentoComponent);
    fixture.componentRef.setInput('lancamentoId', 'e1');
    const add = jest.spyOn(TestBed.inject(MessageService), 'add');
    const upload = { clear: jest.fn() } as unknown as FileUpload;
    const txt = new File(['oi'], 'nota.txt', { type: 'text/plain' });

    fixture.componentInstance.aoSelecionar({ files: [txt], currentFiles: [] } as unknown as FileSelectEvent, upload);

    expect(add).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Arquivo inválido', detail: 'Envie apenas PDF, JPEG ou PNG.' }));
  });
});
