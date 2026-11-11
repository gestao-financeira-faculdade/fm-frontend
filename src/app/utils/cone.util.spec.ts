import { paraPontosHistorico, paraPontosProjecao } from './cone.util';

describe('cone.util', () => {
  it('mapeia histórico com data ISO e Money', () => {
    const [p] = paraPontosHistorico([{ date: '2026-10-26', balance: { amount: 100, currency: 'BRL' } }]);
    expect(p).toEqual({ rotulo: '26/10', valor: 100 });
  });

  it('mapeia projeção com rótulo D+n quando não há data', () => {
    const [p] = paraPontosProjecao([{ day: 3, p01: 1, p05: 2, p25: 3, p50: 4, p75: 5, p95: 6 }]);
    expect(p).toEqual({ rotulo: 'D+3', p01: 1, p05: 2, p25: 3, p50: 4, p75: 5, p95: 6 });
  });
});
