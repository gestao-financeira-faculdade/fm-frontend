import { Role, TODAS_ROLES } from '../../enums/role.enum';

export const CADASTROS_PERMISSOES = {
  visualizar: TODAS_ROLES,
  criarConta: [Role.ADMIN],
  criarCategoria: [Role.ADMIN],
  criarContraparte: [Role.ADMIN, Role.ANALISTA],
} as const satisfies Record<string, readonly Role[]>;
