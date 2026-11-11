import { Opcao } from '../../../interfaces/money.interface';

export enum StatusLancamento {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  PARTIALLY_SETTLED = 'PARTIALLY_SETTLED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

type Severidade = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export const STATUS_LANCAMENTO_META: Record<string, { label: string; severidade: Severidade }> = {
  [StatusLancamento.PENDING]: { label: 'Pendente', severidade: 'info' },
  [StatusLancamento.SETTLED]: { label: 'Liquidado', severidade: 'success' },
  [StatusLancamento.PARTIALLY_SETTLED]: { label: 'Liquidado parcialmente', severidade: 'warn' },
  [StatusLancamento.OVERDUE]: { label: 'Vencido', severidade: 'danger' },
  [StatusLancamento.CANCELLED]: { label: 'Cancelado', severidade: 'secondary' },
};

export const STATUS_LANCAMENTO_OPCOES: Opcao<StatusLancamento>[] = Object.values(StatusLancamento).map((value) => ({
  value,
  label: STATUS_LANCAMENTO_META[value].label,
}));

/** Status que ainda aceitam liquidação ou cancelamento. */
export const STATUS_EM_ABERTO: readonly string[] = [StatusLancamento.PENDING, StatusLancamento.OVERDUE];
