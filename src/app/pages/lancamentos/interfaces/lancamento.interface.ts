import { TipoLancamento } from '../../../enums/tipo-lancamento.enum';
import { StatusLancamento } from '../enums/status-lancamento.enum';

/** Corpo de POST /v1/entries. */
export interface LancamentoRequest {
  description: string;
  entryType: TipoLancamento;
  originalAmount: number;
  currency: string;
  /** YYYY-MM-DD */
  dueDate: string;
  /** YYYY-MM-DD */
  competenceDate: string;
  categoryId: string;
  accountId: string;
  counterpartyId: string | null;
}

/**
 * FinancialEntryResponse. Os campos do request estão no contrato; os demais
 * (saldo, versão, nomes desnormalizados...) são inferidos e opcionais.
 */
export interface Lancamento extends LancamentoRequest {
  id: string;
  status: StatusLancamento;
  outstandingAmount?: number;
  settledAmount?: number;
  settlementDate?: string;
  parentEntryId?: string | null;
  /** Usado como expectedVersion na liquidação (lock otimista). */
  version?: number;
  categoryName?: string;
  accountName?: string;
  counterpartyName?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** FinancialEntrySummaryView (projeção jOOQ da listagem). */
export interface LancamentoResumo {
  id: string;
  description: string;
  entryType: TipoLancamento;
  status: StatusLancamento;
  originalAmount: number;
  outstandingAmount?: number;
  currency: string;
  dueDate: string;
  competenceDate?: string;
  categoryName?: string;
  accountName?: string;
  counterpartyName?: string;
  parentEntryId?: string | null;
}

/** Filtros de GET /v1/entries (também usados na exportação). */
export interface FiltroLancamento {
  entryType?: TipoLancamento | null;
  status?: StatusLancamento | null;
  categoryId?: string | null;
  accountId?: string | null;
  dueDateFrom?: string | null;
  dueDateTo?: string | null;
  search?: string | null;
}

/** FinancialEntryLineageNode — nó da árvore de desdobramentos. */
export interface NoDesdobramento {
  id: string;
  parentEntryId?: string | null;
  description?: string;
  status: StatusLancamento | string;
  originalAmount: number;
  outstandingAmount?: number;
  settledAmount?: number;
  currency?: string;
  dueDate?: string;
}

export function saldoDevedor(l: Pick<Lancamento, 'outstandingAmount' | 'originalAmount'>): number {
  return l.outstandingAmount ?? l.originalAmount;
}
