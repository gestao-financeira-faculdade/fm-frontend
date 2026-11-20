import { Opcao } from '../interfaces/money.interface';
import { TipoLancamento } from './tipo-lancamento.enum';

export enum TipoCategoria {
  PAYABLE = 'PAYABLE',
  RECEIVABLE = 'RECEIVABLE',
  BOTH = 'BOTH',
}

export const TIPO_CATEGORIA_LABEL: Record<TipoCategoria, string> = {
  [TipoCategoria.PAYABLE]: 'A pagar',
  [TipoCategoria.RECEIVABLE]: 'A receber',
  [TipoCategoria.BOTH]: 'Ambos',
};

export const TIPO_CATEGORIA_SEVERIDADE: Record<TipoCategoria, 'danger' | 'success' | 'info'> = {
  [TipoCategoria.PAYABLE]: 'danger',
  [TipoCategoria.RECEIVABLE]: 'success',
  [TipoCategoria.BOTH]: 'info',
};

export const TIPO_CATEGORIA_OPCOES: Opcao<TipoCategoria>[] = Object.values(TipoCategoria).map((value) => ({
  value,
  label: TIPO_CATEGORIA_LABEL[value],
}));

export function categoriaAceitaTipo(categoryType: TipoCategoria, tipo: TipoLancamento | null | undefined): boolean {
  return categoryType === TipoCategoria.BOTH || (categoryType as string) === tipo;
}
