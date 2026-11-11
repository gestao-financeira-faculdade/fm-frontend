import {
  PontoHistorico,
  PontoProjecao,
} from '../shared/components/cone-incerteza-chart/cone-incerteza-chart.interface';

/**
 * Normalização das séries do cone (dashboard e simulações). Os nomes exatos
 * dos campos não estão no contrato, então aceitamos as variações mais prováveis.
 */
const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });

function numero(item: Record<string, unknown>, ...chaves: string[]): number {
  for (const c of chaves) {
    const v = item[c];
    if (typeof v === 'number') return v;
    if (v && typeof v === 'object' && 'amount' in v) return Number((v as { amount: unknown }).amount);
    if (typeof v === 'string' && v !== '' && !Number.isNaN(Number(v))) return Number(v);
  }
  return NaN;
}

export function rotuloPonto(item: Record<string, unknown>, indice: number): string {
  const data = item['date'] ?? item['referenceDate'] ?? item['day'];
  if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}/.test(data)) {
    const [y, m, d] = data.slice(0, 10).split('-').map(Number);
    return formatoData.format(new Date(y, m - 1, d));
  }
  if (typeof data === 'number') return `D+${data}`;
  return `D+${indice + 1}`;
}

export function paraPontosHistorico(itens: Record<string, unknown>[] | null | undefined): PontoHistorico[] {
  return (itens ?? []).map((item, i) => ({
    rotulo: rotuloPonto(item, i),
    valor: numero(item, 'balance', 'value', 'amount', 'closingBalance'),
  }));
}

export function paraPontosProjecao(itens: Record<string, unknown>[] | null | undefined): PontoProjecao[] {
  return (itens ?? []).map((item, i) => ({
    rotulo: rotuloPonto(item, i),
    p01: numero(item, 'p01', 'P01', 'p1'),
    p05: numero(item, 'p05', 'P05', 'p5'),
    p25: numero(item, 'p25', 'P25'),
    p50: numero(item, 'p50', 'P50', 'median'),
    p75: numero(item, 'p75', 'P75'),
    p95: numero(item, 'p95', 'P95'),
  }));
}
