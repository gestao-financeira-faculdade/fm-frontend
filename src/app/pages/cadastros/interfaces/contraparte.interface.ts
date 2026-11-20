import { TipoContraparte } from '../enums/tipo-contraparte.enum';

export interface Contraparte {
  id: string;
  legalName: string;
  tradeName?: string;
  taxId: string | null;
  counterpartyType: TipoContraparte | string;
  active?: boolean;
}

export interface ContraparteRequest {
  legalName: string;
  tradeName?: string;
  taxId?: string;
  counterpartyType: TipoContraparte;
}
