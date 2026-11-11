import { Role, TODAS_ROLES } from '../../enums/role.enum';

export const SIMULACOES_PERMISSOES = {
  visualizar: TODAS_ROLES,
  executar: [Role.ADMIN],
} as const satisfies Record<string, readonly Role[]>;
