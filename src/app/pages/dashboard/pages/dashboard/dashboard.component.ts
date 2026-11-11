import { Component, inject, OnInit, signal } from '@angular/core';

import { Money } from '../../../../interfaces/money.interface';
import { MoedaPipe } from '../../../../pipes/moeda.pipe';
import {
  PontoHistorico,
  PontoProjecao,
} from '../../../../shared/components/cone-incerteza-chart/cone-incerteza-chart.interface';
import { paraPontosHistorico, paraPontosProjecao } from '../../../../utils/cone.util';
import { fimDeHoje, paraDataIso } from '../../../../utils/date.util';
import { SIMULACOES_PERMISSOES } from '../../../simulacoes/simulacoes-permissoes';
import { KpiExecutivo } from '../../interfaces/dashboard.interface';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly moeda = new MoedaPipe();

  readonly permissoesSimulacao = SIMULACOES_PERMISSOES;
  readonly opcoesHistorico = [30, 60, 90, 180, 365].map((d) => ({ label: `${d} dias`, value: d }));
  readonly hoje = fimDeHoje();

  readonly dataReferencia = signal<Date>(new Date());
  readonly diasHistorico = signal(30);

  readonly kpis = signal<KpiExecutivo | null>(null);
  readonly carregandoKpis = signal(true);

  readonly historico = signal<PontoHistorico[]>([]);
  readonly projecao = signal<PontoProjecao[]>([]);
  readonly simulacaoId = signal<string | null>(null);
  readonly carregandoCone = signal(true);

  ngOnInit(): void {
    this.atualizar();
  }

  atualizar(): void {
    const referenceDate = paraDataIso(this.dataReferencia());

    this.carregandoKpis.set(true);
    this.dashboardService.kpis(referenceDate).subscribe({
      next: (kpis) => {
        this.kpis.set(kpis);
        this.carregandoKpis.set(false);
      },
      error: () => this.carregandoKpis.set(false),
    });

    this.carregandoCone.set(true);
    this.dashboardService.coneIncerteza({ historyDays: this.diasHistorico(), referenceDate }).subscribe({
      next: (cone) => {
        this.historico.set(paraPontosHistorico(cone.historicalSeries));
        this.projecao.set(paraPontosProjecao(cone.projectionCone));
        this.simulacaoId.set(cone.simulationId ?? null);
        this.carregandoCone.set(false);
      },
      error: () => {
        this.historico.set([]);
        this.projecao.set([]);
        this.carregandoCone.set(false);
      },
    });
  }

  aoMudarData(data: Date | null): void {
    this.dataReferencia.set(data ?? new Date());
    this.atualizar();
  }

  aoMudarHistorico(dias: number): void {
    this.diasHistorico.set(dias);
    this.atualizar();
  }

  formatar(valor: Money | undefined): string | null {
    return valor ? this.moeda.transform(valor) : null;
  }

  formatarPercentual(valor: number | undefined): string | null {
    if (valor === undefined || valor === null) return null;
    return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  }
}
