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

export interface LiquidacaoResponse {
  id: string;
  status: StatusLancamento;
  settledAmount: number;
  hasResidualChild: boolean;
  residualEntryId: string | null;
  version: number;
}
