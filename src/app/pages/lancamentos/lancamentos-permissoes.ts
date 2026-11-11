import { Role, TODAS_ROLES } from '../../enums/role.enum';

/** Matriz de permissões de Lançamentos (espelha os @PreAuthorize do backend). */
export const LANCAMENTOS_PERMISSOES = {
  visualizar: TODAS_ROLES,
  criar: [Role.ADMIN, Role.ANALISTA],
  liquidar: [Role.ADMIN, Role.ANALISTA],
  cancelar: [Role.ADMIN],
  anexar: [Role.ADMIN, Role.ANALISTA],
  historicoAuditoria: [Role.ADMIN, Role.AUDITOR],
  exportar: TODAS_ROLES,
} as const satisfies Record<string, readonly Role[]>;
