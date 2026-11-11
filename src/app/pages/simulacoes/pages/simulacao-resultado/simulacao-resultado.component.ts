import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

import { paraPontosProjecao } from '../../../../utils/cone.util';
import { Simulacao } from '../../interfaces/simulacao.interface';
import { SimulacaoService } from '../../services/simulacao.service';
import { SIMULACOES_PERMISSOES } from '../../simulacoes-permissoes';

/** Resultado de uma simulação: /simulacoes (última) ou /simulacoes/:id. */
@Component({
  selector: 'app-simulacao-resultado',
  standalone: false,
  templateUrl: './simulacao-resultado.component.html',
})
export class SimulacaoResultadoComponent {
  private readonly simulacaoService = inject(SimulacaoService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  /** Parâmetro de rota opcional. */
  readonly id = input<string>();

  readonly permissoes = SIMULACOES_PERMISSOES;
  readonly simulacao = signal<Simulacao | null>(null);
  readonly carregando = signal(true);
  readonly semSimulacao = signal(false);
  readonly dialogAberto = signal(false);

  readonly projecao = computed(() => paraPontosProjecao(this.simulacao()?.dailyBands));

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.carregar(id));
    });
  }

  aoConcluir(simulacao: Simulacao): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Simulação concluída',
      detail: `${simulacao.numScenarios.toLocaleString('pt-BR')} cenários em ${simulacao.executionTimeMs} ms`,
    });
    if (this.id()) {
      void this.router.navigate(['/simulacoes', simulacao.id]);
    } else {
      this.simulacao.set(simulacao);
      this.semSimulacao.set(false);
    }
  }

  private carregar(id: string | undefined): void {
    this.carregando.set(true);
    this.semSimulacao.set(false);
    const fonte$: Observable<Simulacao> = id ? this.simulacaoService.buscar(id) : this.simulacaoService.ultima();
    fonte$.subscribe({
      next: (s) => {
        this.simulacao.set(s);
        this.carregando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.simulacao.set(null);
        this.carregando.set(false);
        this.semSimulacao.set(e.status === 404);
      },
    });
  }
}
