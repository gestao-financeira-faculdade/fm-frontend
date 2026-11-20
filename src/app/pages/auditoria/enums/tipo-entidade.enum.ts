import { Opcao } from '../../../interfaces/money.interface';

export enum TipoEntidade {
  FINANCIAL_ENTRY = 'FINANCIAL_ENTRY',
  FINANCIAL_ACCOUNT = 'FINANCIAL_ACCOUNT',
  CATEGORY = 'CATEGORY',
  COUNTERPARTY = 'COUNTERPARTY',
}

export const TIPO_ENTIDADE_LABEL: Record<string, string> = {
  [TipoEntidade.FINANCIAL_ENTRY]: 'Lançamento',
  [TipoEntidade.FINANCIAL_ACCOUNT]: 'Conta financeira',
  [TipoEntidade.CATEGORY]: 'Categoria',
  [TipoEntidade.COUNTERPARTY]: 'Contraparte',
};

export const TIPO_ENTIDADE_OPCOES: Opcao<TipoEntidade>[] = Object.values(TipoEntidade).map((value) => ({
  value,
  label: TIPO_ENTIDADE_LABEL[value],
}));
