import { Money } from '../interfaces/money.interface';
import {
  FaixaDiariaProjecao,
  PontoHistorico,
  PontoProjecao,
} from '../shared/components/cone-incerteza-chart/cone-incerteza-chart.interface';

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });

function rotulo(data: string | undefined, dia: number): string {
  if (data && /^\d{4}-\d{2}-\d{2}/.test(data)) {
    const [y, m, d] = data.slice(0, 10).split('-').map(Number);
    return formatoData.format(new Date(y, m - 1, d));
  }
  return `D+${dia}`;
}

export function paraPontosHistorico(itens: { date: string; balance: Money }[] | null | undefined): PontoHistorico[] {
  return (itens ?? []).map((item, i) => ({
    rotulo: rotulo(item.date, i + 1),
    valor: Number(item.balance?.amount),
  }));
}

export function paraPontosProjecao(itens: FaixaDiariaProjecao[] | null | undefined): PontoProjecao[] {
  return (itens ?? []).map((item, i) => ({
    rotulo: rotulo(item.date, item.dayOffset ?? i + 1),
    p01: Number(item.p01),
    p05: Number(item.p05),
    p25: Number(item.p25),
    p50: Number(item.p50),
    p75: Number(item.p75),
    p95: Number(item.p95),
  }));
}
