import { paraPontosHistorico, paraPontosProjecao } from './cone.util';

describe('cone.util', () => {
  it('mapeia histórico com data ISO e Money', () => {
    const [p] = paraPontosHistorico([{ date: '2026-10-26', balance: { amount: 100, currency: 'BRL' } }]);
    expect(p).toEqual({ rotulo: '26/10', valor: 100 });
  });

  it('mapeia as faixas diárias da projeção pela data', () => {
    const [p] = paraPontosProjecao([
      { dayOffset: 1, date: '2026-11-19', p01: 1, p05: 2, p25: 3, p50: 4, p75: 5, p95: 6 },
    ]);
    expect(p).toEqual({ rotulo: '19/11', p01: 1, p05: 2, p25: 3, p50: 4, p75: 5, p95: 6 });
  });

  it('usa D+n quando a faixa não tem data', () => {
    const [p] = paraPontosProjecao([{ dayOffset: 3, date: '', p01: 1, p05: 2, p25: 3, p50: 4, p75: 5, p95: 6 }]);
    expect(p.rotulo).toBe('D+3');
  });

  it('aceita projeção ausente', () => {
    expect(paraPontosProjecao(null)).toEqual([]);
  });
});
