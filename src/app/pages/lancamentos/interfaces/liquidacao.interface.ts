import { StatusLancamento } from '../enums/status-lancamento.enum';

/** Corpo de POST /v1/entries/{id}/settle. */
export interface LiquidacaoRequest {
  paidAmount: number;
  discountAmount: number;
  interestAmount: number;
  lateFeeAmount: number;
  /** YYYY-MM-DD */
  settlementDate: string;
  allowPartial: boolean;
  expectedVersion: number;
}

/** SettlementResponse. Nomes além de status/residual são inferidos. */
export interface LiquidacaoResponse {
  entryId?: string;
  status: StatusLancamento.SETTLED | StatusLancamento.PARTIALLY_SETTLED | string;
  residualEntryId?: string | null;
  settledAmount?: number;
}
