import { HttpEventType } from '@angular/common/http';
import { Component, inject, input, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';

import { salvarResposta } from '../../../../utils/download.util';
import { ANEXO_ACCEPT, ANEXO_TAMANHO_MAXIMO, ANEXO_TIPOS_ACEITOS } from '../../constants/lancamento.constants';
import { Anexo, dataAnexo, nomeAnexo, tamanhoAnexo } from '../../interfaces/anexo.interface';
import { AnexoService } from '../../services/anexo.service';

@Component({
  selector: 'app-anexos-lancamento',
  standalone: false,
  templateUrl: './anexos-lancamento.component.html',
})
export class AnexosLancamentoComponent {
  private readonly anexoService = inject(AnexoService);
  private readonly messageService = inject(MessageService);

  readonly lancamentoId = input.required<string>();
  readonly anexos = input<Anexo[]>([]);
  readonly carregando = input(false);
  readonly podeAnexar = input(false);
  readonly alterado = output<void>();

  readonly progresso = signal<number | null>(null);
  readonly baixando = signal<string | null>(null);

  readonly accept = ANEXO_ACCEPT;
  readonly nome = nomeAnexo;
  readonly tamanho = tamanhoAnexo;
  readonly data = dataAnexo;

  aoSelecionar(evento: FileSelectEvent, upload: FileUpload): void {
    const arquivo = evento.currentFiles[0];
    upload.clear();
    if (!arquivo) {
      if (evento.files?.length) {
        this.messageService.add({ severity: 'warn', summary: 'Arquivo inválido', detail: 'Envie apenas PDF, JPEG ou PNG.' });
      }
      return;
    }

    const problema = this.validar(arquivo);
    if (problema) {
      this.messageService.add({ severity: 'warn', summary: 'Arquivo inválido', detail: problema });
      return;
    }

    this.progresso.set(0);
    this.anexoService.enviar(this.lancamentoId(), arquivo).subscribe({
      next: (e) => {
        if (e.type === HttpEventType.UploadProgress && e.total) {
          this.progresso.set(Math.round((100 * e.loaded) / e.total));
        } else if (e.type === HttpEventType.Response) {
          this.progresso.set(null);
          this.messageService.add({ severity: 'success', summary: 'Comprovante anexado', detail: arquivo.name });
          this.alterado.emit();
        }
      },
      error: () => this.progresso.set(null),
    });
  }

  baixar(anexo: Anexo): void {
    this.baixando.set(anexo.id);
    this.anexoService.baixar(this.lancamentoId(), anexo.id).subscribe({
      next: (resposta) => {
        salvarResposta(resposta, nomeAnexo(anexo));
        this.baixando.set(null);
      },
      error: () => this.baixando.set(null),
    });
  }

  icone(anexo: Anexo): string {
    return anexo.contentType === 'application/pdf' ? 'pi pi-file-pdf text-red-600' : 'pi pi-image text-marca-600';
  }

  private validar(arquivo: File): string | null {
    if (arquivo.size === 0) return 'O arquivo está vazio.';
    if (arquivo.size > ANEXO_TAMANHO_MAXIMO) return 'O arquivo excede o limite de 10 MB.';
    if (arquivo.type && !ANEXO_TIPOS_ACEITOS.includes(arquivo.type)) return 'Envie apenas PDF, JPEG ou PNG.';
    return null;
  }
}
