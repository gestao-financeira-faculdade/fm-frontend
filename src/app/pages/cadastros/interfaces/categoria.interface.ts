import { TipoCategoria } from '../../../enums/tipo-categoria.enum';

export interface Categoria {
  id: string;
  name: string;
  categoryType: TipoCategoria;
  requiresAttachmentAlways: boolean;
  fixedCost: boolean;
  active?: boolean;
}

export interface CategoriaRequest {
  name: string;
  categoryType: TipoCategoria;
  requiresAttachmentAlways: boolean;
  fixedCost: boolean;
}
