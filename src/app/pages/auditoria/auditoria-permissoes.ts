import { Role } from '../../enums/role.enum';

export const AUDITORIA_PERMISSOES = {
  visualizar: [Role.ADMIN, Role.AUDITOR],
} as const satisfies Record<string, readonly Role[]>;
