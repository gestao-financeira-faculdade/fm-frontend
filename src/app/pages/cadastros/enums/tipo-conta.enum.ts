import { Opcao } from '../../../interfaces/money.interface';

export enum TipoConta {
  OPERATIONAL_LEDGER = 'OPERATIONAL_LEDGER',
  TREASURY_LEDGER = 'TREASURY_LEDGER',
  PETTY_CASH = 'PETTY_CASH',
}

export const TIPO_CONTA_LABEL: Record<string, string> = {
  [TipoConta.OPERATIONAL_LEDGER]: 'Conta operacional',
  [TipoConta.TREASURY_LEDGER]: 'Tesouraria',
  [TipoConta.PETTY_CASH]: 'Caixa pequeno',
};

export const TIPO_CONTA_OPCOES: Opcao<TipoConta>[] = Object.values(TipoConta).map((value) => ({
  value,
  label: TIPO_CONTA_LABEL[value],
}));
