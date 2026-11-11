import { TipoLancamento } from '../../../enums/tipo-lancamento.enum';

export interface Categoria {
  id: string;
  name: string;
  categoryType: TipoLancamento;
  requiresAttachmentAlways: boolean;
  fixedCost: boolean;
  active?: boolean;
}

export interface CategoriaRequest {
  name: string;
  categoryType: TipoLancamento;
  requiresAttachmentAlways: boolean;
  fixedCost: boolean;
}
