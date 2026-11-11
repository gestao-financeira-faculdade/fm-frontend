/** Perfis RBAC emitidos pelo backend no JWT / UserSummaryResponse. */
export enum Role {
  ADMIN = 'ADMIN',
  ANALISTA = 'ANALISTA',
  AUDITOR = 'AUDITOR',
}

export const ROLE_LABEL: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.ANALISTA]: 'Analista',
  [Role.AUDITOR]: 'Auditor',
};

export const TODAS_ROLES: readonly Role[] = [Role.ADMIN, Role.ANALISTA, Role.AUDITOR];
