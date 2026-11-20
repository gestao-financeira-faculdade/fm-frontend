import { Opcao } from '../../../interfaces/money.interface';

export enum StatusLancamento {
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  PAID = 'PAID',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

type Severidade = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export const STATUS_LANCAMENTO_META: Record<string, { label: string; severidade: Severidade }> = {
  [StatusLancamento.PENDING]: { label: 'Pendente', severidade: 'info' },
  [StatusLancamento.OVERDUE]: { label: 'Vencido', severidade: 'danger' },
  [StatusLancamento.PAID]: { label: 'Pago', severidade: 'success' },
  [StatusLancamento.RECEIVED]: { label: 'Recebido', severidade: 'success' },
  [StatusLancamento.CANCELLED]: { label: 'Cancelado', severidade: 'secondary' },
};

export const STATUS_LANCAMENTO_OPCOES: Opcao<StatusLancamento>[] = Object.values(StatusLancamento).map((value) => ({
  value,
  label: STATUS_LANCAMENTO_META[value].label,
}));

/** Status que ainda aceitam liquidação ou cancelamento. */
export const STATUS_EM_ABERTO: readonly string[] = [StatusLancamento.PENDING, StatusLancamento.OVERDUE];
