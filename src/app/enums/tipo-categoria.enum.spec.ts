import { categoriaAceitaTipo, TIPO_CATEGORIA_OPCOES, TipoCategoria } from './tipo-categoria.enum';
import { TipoLancamento } from './tipo-lancamento.enum';

describe('tipo-categoria.enum', () => {
  it('oferece os três tipos do backend, incluindo BOTH', () => {
    expect(TIPO_CATEGORIA_OPCOES.map((o) => o.value)).toEqual(['PAYABLE', 'RECEIVABLE', 'BOTH']);
  });

  it('categoria BOTH serve para lançamentos a pagar e a receber', () => {
    expect(categoriaAceitaTipo(TipoCategoria.BOTH, TipoLancamento.PAYABLE)).toBe(true);
    expect(categoriaAceitaTipo(TipoCategoria.BOTH, TipoLancamento.RECEIVABLE)).toBe(true);
  });

  it('categoria de um tipo só serve para o próprio tipo', () => {
    expect(categoriaAceitaTipo(TipoCategoria.PAYABLE, TipoLancamento.PAYABLE)).toBe(true);
    expect(categoriaAceitaTipo(TipoCategoria.PAYABLE, TipoLancamento.RECEIVABLE)).toBe(false);
  });
});
