import { TipoConta } from '../enums/tipo-conta.enum';

/** Resposta de /v1/accounts. Campos além do request são inferidos. */
export interface ContaFinanceira {
  id: string;
  name: string;
  accountType: TipoConta | string;
  initialBalance: number;
  currentBalance?: number;
  currency: string;
  active?: boolean;
}

export interface ContaFinanceiraRequest {
  name: string;
  accountType: TipoConta;
  initialBalance: number;
  currency: string;
}
