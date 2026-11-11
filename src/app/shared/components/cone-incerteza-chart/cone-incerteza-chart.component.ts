import { Component, computed, input } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';

import { comOpacidade, CORES } from '../../../theme/colors';
import { PontoHistorico, PontoProjecao } from './cone-incerteza-chart.interface';

type Serie = (number | null)[];

/** Índices dos datasets que são só "borda superior" de uma faixa (ocultos na legenda). */
const OCULTOS_NA_LEGENDA = [1, 3];

/**
 * Gráfico do Cone de Incerteza: saldo histórico + faixas de percentis da
 * projeção Monte Carlo (P05–P95, P25–P75, mediana P50 e cenário de estresse P01).
 */
@Component({
  selector: 'app-cone-incerteza-chart',
  standalone: false,
  templateUrl: './cone-incerteza-chart.component.html',
})
export class ConeIncertezaChartComponent {
  readonly historico = input<PontoHistorico[]>([]);
  readonly projecao = input<PontoProjecao[]>([]);
  readonly altura = input('22rem');

  private readonly moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  private readonly moedaCompacta = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
  });

  readonly vazio = computed(() => this.historico().length === 0 && this.projecao().length === 0);

  readonly data = computed<ChartData<'line'>>(() => {
    const hist = this.historico();
    const proj = this.projecao();
    const rotulos = [...hist.map((p) => p.rotulo), ...proj.map((p) => p.rotulo)];
    const n = rotulos.length;
    const vaziaDe = (): Serie => new Array<number | null>(n).fill(null);

    const historico = vaziaDe();
    hist.forEach((p, i) => (historico[i] = p.valor));

    const faixa = (chave: keyof Omit<PontoProjecao, 'rotulo'>): Serie => {
      const serie = vaziaDe();
      proj.forEach((p, i) => (serie[hist.length + i] = p[chave]));
      // Conecta o cone ao último ponto real do histórico.
      if (hist.length && proj.length) serie[hist.length - 1] = hist[hist.length - 1].valor;
      return serie;
    };

    const marca = CORES.marca;
    const linhaFina = { pointRadius: 0, borderWidth: 1, tension: 0.25 };

    return {
      labels: rotulos,
      datasets: [
        {
          label: 'Saldo realizado',
          data: historico,
          borderColor: marca[800],
          backgroundColor: marca[800],
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.25,
        },
        { label: 'P95', data: faixa('p95'), borderColor: comOpacidade(marca[500], 0.35), fill: false, ...linhaFina },
        {
          label: 'Faixa P05–P95',
          data: faixa('p05'),
          borderColor: comOpacidade(marca[500], 0.35),
          backgroundColor: comOpacidade(marca[400], 0.15),
          fill: '-1',
          ...linhaFina,
        },
        { label: 'P75', data: faixa('p75'), borderColor: comOpacidade(marca[600], 0.5), fill: false, ...linhaFina },
        {
          label: 'Faixa P25–P75',
          data: faixa('p25'),
          borderColor: comOpacidade(marca[600], 0.5),
          backgroundColor: comOpacidade(marca[500], 0.3),
          fill: '-1',
          ...linhaFina,
        },
        {
          label: 'Mediana (P50)',
          data: faixa('p50'),
          borderColor: marca[600],
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.25,
        },
        {
          label: 'Estresse (P01)',
          data: faixa('p01'),
          borderColor: CORES.despesa,
          borderDash: [2, 3],
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.25,
        },
      ],
    };
  });

  readonly options = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 6,
          filter: (item) => !OCULTOS_NA_LEGENDA.includes(item.datasetIndex ?? -1),
        },
      },
      tooltip: {
        filter: (item) => item.parsed.y !== null,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${this.moeda.format(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 10, autoSkip: true } },
      y: {
        ticks: { callback: (v) => this.moedaCompacta.format(Number(v)) },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
      },
    },
  }));
}
