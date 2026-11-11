import { Opcao } from '../../../interfaces/money.interface';

/**
 * counterpartyType. SUPPLIER está no contrato; CUSTOMER é inferido
 * ("Clientes e Fornecedores") — confirme com o backend.
 */
export enum TipoContraparte {
  SUPPLIER = 'SUPPLIER',
  CUSTOMER = 'CUSTOMER',
}

export const TIPO_CONTRAPARTE_LABEL: Record<string, string> = {
  [TipoContraparte.SUPPLIER]: 'Fornecedor',
  [TipoContraparte.CUSTOMER]: 'Cliente',
};

export const TIPO_CONTRAPARTE_OPCOES: Opcao<TipoContraparte>[] = [
  { label: 'Fornecedor', value: TipoContraparte.SUPPLIER },
  { label: 'Cliente', value: TipoContraparte.CUSTOMER },
];
