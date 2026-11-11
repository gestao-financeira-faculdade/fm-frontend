import { Opcao } from '../interfaces/money.interface';

/** entryType / categoryType — compartilhado por lançamentos, categorias e relatórios. */
export enum TipoLancamento {
  PAYABLE = 'PAYABLE',
  RECEIVABLE = 'RECEIVABLE',
}

export const TIPO_LANCAMENTO_LABEL: Record<TipoLancamento, string> = {
  [TipoLancamento.PAYABLE]: 'A pagar',
  [TipoLancamento.RECEIVABLE]: 'A receber',
};

export const TIPO_LANCAMENTO_OPCOES: Opcao<TipoLancamento>[] = [
  { label: 'A pagar', value: TipoLancamento.PAYABLE },
  { label: 'A receber', value: TipoLancamento.RECEIVABLE },
];
