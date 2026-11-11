import { Component, inject, input, OnInit, signal } from '@angular/core';

import { metaAcao } from '../../../auditoria/enums/acao-auditoria.enum';
import { atorRegistro, dataRegistro, RegistroAuditoria } from '../../../auditoria/interfaces/auditoria.interface';
import { AuditoriaService } from '../../../auditoria/services/auditoria.service';

/** Linha do tempo das transições de estado do lançamento (ADMIN / AUDITOR). */
@Component({
  selector: 'app-historico-lancamento',
  standalone: false,
  templateUrl: './historico-lancamento.component.html',
})
export class HistoricoLancamentoComponent implements OnInit {
  private readonly auditoriaService = inject(AuditoriaService);

  readonly lancamentoId = input.required<string>();

  readonly eventos = signal<RegistroAuditoria[]>([]);
  readonly carregando = signal(true);
  readonly expandido = signal<string | null>(null);

  readonly meta = metaAcao;
  readonly data = dataRegistro;
  readonly ator = atorRegistro;

  ngOnInit(): void {
    this.auditoriaService.historicoLancamento(this.lancamentoId()).subscribe({
      next: (eventos) => {
        this.eventos.set(eventos);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  alternar(id: string): void {
    this.expandido.update((atual) => (atual === id ? null : id));
  }
}
