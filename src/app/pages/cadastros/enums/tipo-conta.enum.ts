import { Opcao } from '../../../interfaces/money.interface';

/**
 * accountType. O contrato só documenta OPERATIONAL_LEDGER;
 * acrescente aqui os demais valores do enum do backend.
 */
export enum TipoConta {
  OPERATIONAL_LEDGER = 'OPERATIONAL_LEDGER',
}

export const TIPO_CONTA_LABEL: Record<string, string> = {
  [TipoConta.OPERATIONAL_LEDGER]: 'Conta operacional',
};

export const TIPO_CONTA_OPCOES: Opcao<TipoConta>[] = Object.values(TipoConta).map((value) => ({
  value,
  label: TIPO_CONTA_LABEL[value] ?? value,
}));
