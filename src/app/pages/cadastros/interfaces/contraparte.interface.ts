import { TipoContraparte } from '../enums/tipo-contraparte.enum';

export interface Contraparte {
  id: string;
  legalName: string;
  tradeName?: string;
  taxId: string;
  counterpartyType: TipoContraparte | string;
  active?: boolean;
}

export interface ContraparteRequest {
  legalName: string;
  tradeName?: string;
  /** Enviado formatado, como no exemplo do contrato: "12.345.678/0001-90". */
  taxId: string;
  counterpartyType: TipoContraparte;
}
