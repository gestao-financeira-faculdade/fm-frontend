import { Opcao } from '../../../interfaces/money.interface';

export enum TipoContraparte {
  SUPPLIER = 'SUPPLIER',
  CUSTOMER = 'CUSTOMER',
  GOVERNMENT = 'GOVERNMENT',
  EMPLOYEE = 'EMPLOYEE',
  OTHER = 'OTHER',
}

export const TIPO_CONTRAPARTE_LABEL: Record<string, string> = {
  [TipoContraparte.SUPPLIER]: 'Fornecedor',
  [TipoContraparte.CUSTOMER]: 'Cliente',
  [TipoContraparte.GOVERNMENT]: 'Órgão público',
  [TipoContraparte.EMPLOYEE]: 'Colaborador',
  [TipoContraparte.OTHER]: 'Outro',
};

export const TIPO_CONTRAPARTE_OPCOES: Opcao<TipoContraparte>[] = Object.values(TipoContraparte).map((value) => ({
  value,
  label: TIPO_CONTRAPARTE_LABEL[value],
}));
