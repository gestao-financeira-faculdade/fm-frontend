import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, model, output, signal, untracked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { mensagemErro } from '../../../../utils/problem-detail.util';
import { CENARIOS_MAX, CENARIOS_MIN, HORIZONTES_DIAS, SIMULACAO_PADRAO } from '../../constants/simulacao.constants';
import { Simulacao } from '../../interfaces/simulacao.interface';
import { SimulacaoService } from '../../services/simulacao.service';

@Component({
  selector: 'app-nova-simulacao-dialog',
  standalone: false,
  templateUrl: './nova-simulacao-dialog.component.html',
})
export class NovaSimulacaoDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly simulacaoService = inject(SimulacaoService);

  readonly visivel = model(false);
  readonly concluida = output<Simulacao>();

  readonly executando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly horizontes = HORIZONTES_DIAS.map((d) => ({ label: `${d} dias`, value: d }));
  readonly cenariosMin = CENARIOS_MIN;
  readonly cenariosMax = CENARIOS_MAX;

  readonly form = this.fb.group({
    horizonDays: [SIMULACAO_PADRAO.horizonDays, Validators.required],
    numScenarios: [
      SIMULACAO_PADRAO.numScenarios,
      [Validators.required, Validators.min(CENARIOS_MIN), Validators.max(CENARIOS_MAX)],
    ],
    expectedDefaultRate: [SIMULACAO_PADRAO.expectedDefaultRate, [Validators.required, Validators.min(0), Validators.max(100)]],
    variableCostShockPct: [SIMULACAO_PADRAO.variableCostShockPct, [Validators.required, Validators.min(-100), Validators.max(100)]],
    randomSeed: [SIMULACAO_PADRAO.randomSeed],
  });

  constructor() {
    // Reseta ao abrir (e não no onShow, que roda após a animação e apagaria o que já foi digitado).
    effect(() => {
      if (this.visivel()) untracked(() => this.aoAbrir());
    });
  }

  aoAbrir(): void {
    this.erro.set(null);
    this.executando.set(false);
  }

  restaurarPadrao(): void {
    this.form.reset(SIMULACAO_PADRAO);
  }

  executar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.executando.set(true);
    this.erro.set(null);
    this.simulacaoService
      .executar({
        horizonDays: v.horizonDays!,
        numScenarios: v.numScenarios!,
        expectedDefaultRate: v.expectedDefaultRate!,
        variableCostShockPct: v.variableCostShockPct!,
        randomSeed: v.randomSeed ?? undefined,
      })
      .subscribe({
        next: (simulacao) => {
          this.executando.set(false);
          this.concluida.emit(simulacao);
          this.visivel.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.executando.set(false);
          this.erro.set(
            e.status === 503
              ? 'O motor de simulação atingiu o limite de execuções simultâneas. Aguarde alguns instantes e tente novamente.'
              : mensagemErro(e),
          );
        },
      });
  }
}
